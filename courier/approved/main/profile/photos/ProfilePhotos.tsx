import { useActionSheet } from '@expo/react-native-action-sheet';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Dimensions, Image, ImageURISource, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as icons from '../../../../../assets/icons';
import { ApiContext } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import ConfigItem from '../../../../../common/components/views/ConfigItem';
import useCourierDocumentImage from '../../../../../common/store/api/courier/hooks/useCourierDocumentImage';
import useCourierSelfie from '../../../../../common/store/api/courier/hooks/useCourierSelfie';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { colors, halfPadding, padding, screens } from '../../../../../common/styles';
import { LoggedNavigatorParamList } from '../../../../../consumer/v2/types';
import { t } from '../../../../../strings';
import { ApprovedParamList } from '../../../types';
import { CourierProfileParamList } from '../types';
import DocumentButton from './DocumentButton';

export const defaultImageOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  // aspect: [4, 3],
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

  type ChangeImageType = typeof setNewSelfie;

  const size = courier.situation === 'approved' ? '1024x1024' : undefined;
  const currentSelfieQuery = useCourierSelfie(courier.id, size);
  const uploadSelfie = useMutation(
    (localUri: string) => api.courier().uploadSelfie(courier.id, localUri),
    {
      onSuccess: () => {
        track('courier uploaded selfie');
        currentSelfieQuery.refetch();
      },
    }
  );

  const currentDocumentImageQuery = useCourierDocumentImage(courier.id, size);
  const uploadDocumentImage = useMutation(
    (localUri: string) => api.courier().uploadDocumentImage(courier.id, localUri),
    {
      onSuccess: () => {
        track('courier uploaded document image');
        currentDocumentImageQuery.refetch();
      },
    }
  );
  const canProceed = React.useMemo(() => {
    // no reason to upload if nothing has changed
    if (!newSelfie && !newDocumentImage) return false;
    return (newSelfie || currentSelfie) && (newDocumentImage || currentDocumentImage);
  }, [newSelfie, newDocumentImage]);

  // side effects
  // tracking
  useSegmentScreen('Profile Photos');
  // when current selfie is loaded, update state
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
  const pickFromCamera = async (changeImage: ChangeImageType, aspect: [number, number]) => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (granted) {
      const result = await ImagePicker.launchCameraAsync({ ...defaultImageOptions, aspect });
      if (result.cancelled) return;
      changeImage(result);
    } else {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos acessar sua câmera'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  };
  const pickFromGallery = async (changeImage: ChangeImageType, aspect: [number, number]) => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) {
      const result = await ImagePicker.launchImageLibraryAsync({ ...defaultImageOptions, aspect });
      if (result.cancelled) return;
      changeImage(result);
    } else {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos acessar sua galeria'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  };

  const actionSheetHandler = (changeImage: ChangeImageType, aspect: [number, number]) =>
    showActionSheetWithOptions(
      {
        options: [t('Tirar uma foto'), t('Escolher da galeria'), t('Cancelar')],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 2) {
          // cancel action
        } else if (buttonIndex === 1) {
          pickFromGallery(changeImage, aspect);
          track('courier is picking image from image gallery');
        } else if (buttonIndex === 0) {
          pickFromCamera(changeImage, aspect);
          track('courier is picking image from camera');
        }
      }
    );
  // UI
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <ConfigItem
        title={t('Foto do rosto')}
        subtitle={t('Adicionar selfie')}
        onPress={() => actionSheetHandler(setNewSelfie, [1, 1])}
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
        onPress={() => actionSheetHandler(setNewDocumentImage, [8.5, 12])}
        checked={!!currentDocumentImageQuery.data && !uploadDocumentImage.isLoading}
      >
        {uploadDocumentImage.isLoading && (
          <View style={{ marginBottom: 16 }}>
            <RoundedText backgroundColor={colors.white}>{t('Enviando imagem')}</RoundedText>
          </View>
        )}
      </ConfigItem>
      <View style={[styles.imagesContainer, { marginVertical: 24 }]}>
        <View style={{ marginBottom: height > 640 ? 24 : 0 }}>
          <DocumentButton
            title={t('Foto de rosto')}
            onPress={() => actionSheetHandler(setNewSelfie, [1, 1])}
            hasTitle={!currentSelfie && !newSelfie}
          >
            <Image
              source={newSelfie ?? currentSelfie ?? icons.selfie}
              resizeMode="cover"
              style={newSelfie || currentSelfie ? styles.image : styles.icon}
            />
          </DocumentButton>
        </View>

        <DocumentButton
          title={t('RG ou CNH aberta')}
          onPress={() => actionSheetHandler(setNewDocumentImage, [8.5, 12])}
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
      <SafeAreaView>
        <DefaultButton
          title={courier.situation === 'approved' ? t('Atualizar') : t('Avançar')}
          disabled={!canProceed}
          onPress={() => navigation.goBack()}
          activityIndicator={busy || uploadSelfie.isLoading || uploadDocumentImage.isLoading}
          style={{ marginBottom: padding, marginHorizontal: padding }}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 48,
  },
  image: {
    width: height > 640 ? 160 : 152,
    height: height > 640 ? 160 : 152,
    borderRadius: height > 640 ? 80 : 76,
  },
  imagesContainer: {
    flexDirection: height > 640 ? 'column' : 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: height > 640 ? 368 : 196,
    // height: '100%',
    alignItems: 'center',
    padding: width <= 320 ? halfPadding : padding,
    flex: 1,
  },
});
