import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageURISource,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { box, house } from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { defaultImageOptions } from '../main/profile/photos/ProfilePhotos';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'NoCodeDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'NoCodeDelivery'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const NoCodeDelivery = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const order = useObserveOrder(orderId);
  const [isLoading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [packagePhoto, setPackagePhoto] = React.useState<ImageURISource | undefined | null>();
  const [frontPhoto, setFrontPhoto] = React.useState<ImageURISource | undefined | null>();
  const [packageUploaded, setPackageUploaded] = React.useState(false);
  const [frontUploaded, setFrontUploaded] = React.useState(false);
  const uploadPODPackage = useMutation(
    (localUri: string) => api.courier().uploadPODPackage(orderId, order!.courier!.id, localUri),
    {
      onSuccess: () => {
        setPackageUploaded(true);
        setLoading(false);
        track('courier uploaded POD package photo');
      },
    }
  );
  const uploadPODFront = useMutation(
    (localUri: string) => api.courier().uploadPODFront(orderId, order!.courier!.id, localUri),
    {
      onSuccess: () => {
        setFrontUploaded(true);
        setLoading(false);
        track('courier uploaded POD front photo');
      },
    }
  );
  // side effects
  //upload POD package photo
  React.useEffect(() => {
    if (packagePhoto?.uri) {
      setLoading(true);
      uploadPODPackage.mutate(packagePhoto.uri);
    }
  }, [packagePhoto]);
  //upload POD front photo
  React.useEffect(() => {
    if (frontPhoto?.uri) {
      setLoading(true);
      uploadPODFront.mutate(frontPhoto.uri);
    }
  }, [frontPhoto]);
  //refs
  const descriptionRef = React.useRef<TextInput>(null);
  // tracking
  useSegmentScreen('NoCodeDelivery');
  // UI handlers
  const photoHandler = async (type: 'package' | 'front', aspect: [number, number]) => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (granted) {
      const result = await ImagePicker.launchCameraAsync({ ...defaultImageOptions, aspect });
      if (result.cancelled) return;
      if (type === 'package') setPackagePhoto(result);
      else if (type === 'front') setFrontPhoto(result);
    } else {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos acessar sua câmera'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  };
  const confirmHandler = () => {
    Keyboard.dismiss();
    if (!frontPhoto || !packagePhoto || !name) return;
    if (!frontUploaded)
      dispatch(showToast('Foto da fachada não carregada corretamente. Tente novamente', 'error'));
    if (!packageUploaded)
      dispatch(showToast('Foto do pacote não carregada corretamente. Tente novamente', 'error'));
    (async () => {
      try {
        setLoading(true);
        await api.order().completeDelivery(orderId, undefined, name, description);
        track('courier completed a no code delivery');
        setLoading(false);
      } catch (error) {
        setLoading(false);
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <ScrollView
      style={{ ...screens.default }}
      contentContainerStyle={{ flex: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <PaddedView style={{ flex: 1 }}>
        <DefaultInput
          title={t('Nome do recebedor')}
          placeholder={t('Nome de quem recebeu a encomenda')}
          value={name}
          returnKeyType="next"
          blurOnSubmit={false}
          onChangeText={(text) => setName(text)}
          onSubmitEditing={() => descriptionRef.current?.focus()}
          keyboardType="default"
        />
        <DefaultInput
          ref={descriptionRef}
          title={t('Descrição adicional')}
          placeholder={t('Se quiser, escreva uma descrição (por exemplo, encomenda na portaria)')}
          value={description}
          returnKeyType="next"
          blurOnSubmit
          onChangeText={(text) => setDescription(text)}
          keyboardType="default"
          style={{ marginVertical: padding, height: 96, flexWrap: 'wrap' }}
          multiline
        />
        <Text style={{ ...texts.sm }}>
          {t('Agora, tire uma foto da encomenda e da fachada do local de entrega:')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: padding,
          }}
        >
          <TouchableOpacity onPress={() => photoHandler('package', [1, 1])}>
            <View
              style={{
                ...borders.default,
                height: 160,
                width: 160,
                backgroundColor: colors.grey50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={packagePhoto ?? box}
                  resizeMode="cover"
                  style={packagePhoto ? styles.photo : styles.icon}
                />
                {!packagePhoto && (
                  <Text style={{ ...texts.xs, marginTop: halfPadding }}>
                    {t('Foto da encomenda')}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => photoHandler('front', [1, 1])}>
            <View
              style={{
                ...borders.default,
                height: 160,
                width: 160,
                backgroundColor: colors.grey50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={frontPhoto ?? house}
                  resizeMode="cover"
                  style={frontPhoto ? styles.photo : styles.icon}
                />
                {!frontPhoto && (
                  <Text style={{ ...texts.xs, marginTop: halfPadding }}>
                    {t('Foto da fachada')}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
        <DefaultButton
          title={t('Confirmar entrega')}
          onPress={confirmHandler}
          activityIndicator={isLoading}
          disabled={!frontUploaded || !packageUploaded || !name || isLoading}
        />
      </PaddedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
  photo: {
    borderRadius: 8,
    height: 160,
    width: 160,
  },
});
