import { useActionSheet } from '@expo/react-native-action-sheet';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourierDocumentType } from 'appjusto-types/courier';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageURISource,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import ConfigItem from '../../../../../common/components/views/ConfigItem';
import HR from '../../../../../common/components/views/HR';
import ShowIf from '../../../../../common/components/views/ShowIf';
import useCourierDocumentImage from '../../../../../common/store/api/courier/hooks/useCourierDocumentImage';
import useCourierSelfie from '../../../../../common/store/api/courier/hooks/useCourierSelfie';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { LoggedNavigatorParamList } from '../../../../../consumer/v2/types';
import { t } from '../../../../../strings';
import { ApprovedParamList } from '../../../types';
import { CourierProfileParamList } from '../types';
import DocumentButton from './DocumentButton';

const defaultImageOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
};

const { height, width } = Dimensions.get('window');

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CourierProfileParamList, 'ProfilePhotos'>,
  StackNavigationProp<LoggedNavigatorParamList & ApprovedParamList>
>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'ProfilePhotos'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;

  // screen state
  const [currentSelfie, setCurrentSelfie] = React.useState<ImageURISource | undefined | null>();
  const [newSelfie, setNewSelfie] = React.useState<ImageURISource | undefined | null>();
  const [currentDocumentImage, setCurrentDocumentImage] = React.useState<
    ImageURISource | undefined | null
  >();
  const [newDocumentImage, setNewDocumentImage] = React.useState<
    ImageURISource | undefined | null
  >();
  const [documentType, setDocumentType] = React.useState<CourierDocumentType | undefined | null>();
  const [inputValue, setInputValue] = React.useState<string>();

  type ChangeImageType = typeof setNewSelfie;

  const currentSelfieQuery = useCourierSelfie(courier.id);
  const uploadSelfie = useMutation(
    (localUri: string) => api.courier().uploadSelfie(courier.id, localUri),
    {
      onSuccess: () => {
        currentSelfieQuery.refetch();
      },
    }
  );

  const currentDocumentImageQuery = useCourierDocumentImage(courier.id);
  const uploadDocumentImage = useMutation(
    (localUri: string) => api.courier().uploadDocumentImage(courier.id, localUri),
    {
      onSuccess: () => {
        currentDocumentImageQuery.refetch();
      },
    }
  );

  const canProceed = React.useMemo(() => {
    // no reason to upload if nothing has changed
    if (!newSelfie && !newDocumentImage) return false;
    return (
      (newSelfie || currentSelfie) && (newDocumentImage || currentDocumentImage) && documentType
    );
  }, [newSelfie, newDocumentImage, documentType]);

  // side effects
  // when current self is loaded, update state
  React.useEffect(() => {
    if (currentSelfieQuery.data) {
      setCurrentSelfie({ uri: currentSelfieQuery.data });
    }
  }, [currentSelfieQuery.data]);
  // when user picks a new selfie, upload it
  React.useEffect(() => {
    if (newSelfie?.uri) {
      uploadSelfie.mutate(newSelfie.uri);
    }
  }, [newSelfie]);
  // when current document image is loaded, update state
  React.useEffect(() => {
    if (currentDocumentImageQuery.data) {
      setCurrentDocumentImage({ uri: currentDocumentImageQuery.data });
    }
  }, [currentDocumentImageQuery.data]);
  // when user picks a new document image, upload it
  React.useEffect(() => {
    if (newDocumentImage?.uri) {
      uploadDocumentImage.mutate(newDocumentImage.uri);
    }
  }, [newDocumentImage]);

  // handlers
  const pickFromCamera = React.useCallback(async (changeImage: ChangeImageType) => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      const result = await ImagePicker.launchCameraAsync(defaultImageOptions);
      if (result.cancelled) return;
      changeImage(result);
    } else {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos acessar sua câmera'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  }, []);
  const pickFromGallery = React.useCallback(async (changeImage: ChangeImageType) => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      const result = await ImagePicker.launchImageLibraryAsync(defaultImageOptions);
      if (result.cancelled) return;
      changeImage(result);
    } else {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos acessar sua galeria'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  }, []);

  const actionSheetHandler = (changeImage: ChangeImageType) =>
    showActionSheetWithOptions(
      {
        options: [t('Tirar uma foto'), t('Escolher da galeria'), t('Cancelar')],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 2) {
          // cancel action
        } else if (buttonIndex === 1) {
          pickFromGallery(changeImage);
        } else if (buttonIndex === 0) {
          pickFromCamera(changeImage);
        }
      }
    );

  // const updatePhotosHandler = async () => {
  //   try {
  //     await dispatch(updateProfile(api)(courier.id, updatedCourier));
  //     navigation.goBack();
  //   } catch (error) {
  //     dispatch(showToast(t('Não foi possível atualizar seu perfil.')));
  //   }
  // };

  // UI
  return (
    <ScrollView>
      <View style={{ ...screens.config }}>
        <PaddedView style={{ marginBottom: padding }}>
          <Text style={{ ...texts.x2l, marginBottom: halfPadding }}>{t('Fotos e documentos')}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('Se você optou por ')}
            <Text style={[{ ...texts.sm, color: colors.grey700 }, texts.bold]}>{t('Moto ')}</Text>
            {t('e/ou ')}
            <Text style={[{ ...texts.sm, color: colors.grey700 }, texts.bold]}>{t('Carro')}</Text>
            {t(
              ', vamos precisar também da foto da sua CNH; caso contrário, é só enviar a foto do seu RG.'
            )}
          </Text>
        </PaddedView>
        <HR color={colors.grey500} />
        <ConfigItem
          title={t('Foto do rosto')}
          subtitle={t('Adicionar selfie')}
          onPress={() => actionSheetHandler(setNewSelfie)}
          checked={!!currentSelfieQuery.data && !uploadSelfie.isLoading}
        >
          {uploadSelfie.isLoading && (
            <View style={{ marginBottom: 16 }}>
              <RoundedText backgroundColor={colors.white}>{t('Enviando imagem')}</RoundedText>
            </View>
          )}
        </ConfigItem>
        <ConfigItem
          title={t('RG ou CNH aberta')}
          subtitle={t('Adicionar foto do documento')}
          onPress={() => actionSheetHandler(setNewDocumentImage)}
          checked={!!currentDocumentImageQuery.data && !uploadDocumentImage.isLoading}
        >
          {uploadDocumentImage.isLoading && (
            <View style={{ marginBottom: 16 }}>
              <RoundedText backgroundColor={colors.white}>{t('Enviando imagem')}</RoundedText>
            </View>
          )}
        </ConfigItem>
        <Text style={{ ...texts.sm, marginTop: padding, paddingHorizontal: padding }}>
          {t('Qual documento você optou por enviar?')}
        </Text>
        <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            title={t('RG')}
            onPress={() => setDocumentType('rg')}
            checked={documentType === 'rg'}
          />
          <RadioButton
            title={t('CNH')}
            onPress={() => setDocumentType('cnh')}
            style={{ marginLeft: padding }}
            checked={documentType === 'cnh'}
          />
        </PaddedView>
        <DefaultInput
          title={t('Número do documento')}
          placeholder={t('Digite o número do seu documento')}
          style={{ marginBottom: padding, marginHorizontal: padding }}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <HR color={colors.grey500} />
        <Text style={{ ...texts.sm, padding }}>{t('Verifique se as imagens estão legíveis:')}</Text>
        <View style={styles.imagesContainer}>
          <DocumentButton
            title={t('Foto de rosto')}
            onPress={() => actionSheetHandler(setNewSelfie)}
            hasTitle={!currentSelfie && !newSelfie}
          >
            <Image
              source={newSelfie ?? currentSelfie ?? icons.selfie}
              resizeMode="cover"
              style={newSelfie || currentSelfie ? styles.image : styles.icon}
            />
          </DocumentButton>

          <DocumentButton
            title={t('RG ou CNH aberta')}
            onPress={() => actionSheetHandler(setNewDocumentImage)}
            hasTitle={!currentDocumentImage && !newDocumentImage}
          >
            <Image
              source={newDocumentImage ?? currentDocumentImage ?? icons.license}
              resizeMode="cover"
              style={newDocumentImage || currentDocumentImage ? styles.image : styles.icon}
            />
          </DocumentButton>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ marginBottom: 32, paddingHorizontal: padding }}>
          <ShowIf test={!currentSelfie && !currentDocumentImage}>
            {() => (
              <DefaultButton
                title={t('Avançar')}
                disabled={!canProceed}
                onPress={() => navigation.goBack()}
                activityIndicator={busy || uploadSelfie.isLoading || uploadDocumentImage.isLoading}
              />
            )}
          </ShowIf>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 48,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  imagesContainer: {
    flexDirection: height > 700 ? 'column' : 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: height > 700 ? 368 : 196,
    alignItems: 'center',
    // padding: width > 360 ? 16 : 0,
    padding: width <= 320 ? 0 : 16,
  },
});
