import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Issue, WithId } from 'appjusto-types';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { ActivityIndicator, ImageURISource, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { defaultImageOptions } from '../main/profile/photos/ProfilePhotos';
import { ApprovedParamList } from '../types';
import { NoCodePhotoButton } from './NoCodePhotoButton';
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
  const issues = useIssues('no-code-delivery');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [isLoading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [packagePhoto, setPackagePhoto] = React.useState<ImageURISource | undefined | null>();
  //refs
  const descriptionRef = React.useRef<TextInput>(null);
  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // UI handlers

  const packagePhotoHandler = async (aspect: [number, number]) => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      const result = await ImagePicker.launchCameraAsync({ ...defaultImageOptions, aspect });
      if (result.cancelled) return;
      setPackagePhoto(result);
    } else {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos acessar sua câmera'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
  };
  const confirmHandler = () => {
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().createIssue(orderId, {
          issue: selectedIssue,
        });
        setLoading(false);
        navigation.navigate('OngoingDelivery', { orderId, completeWithoutConfirmation: true });
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  console.log(packagePhoto);
  return (
    <ScrollView style={{ ...screens.default }} contentContainerStyle={{ flex: 1 }}>
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
          <NoCodePhotoButton
            title={t('Foto da encomenda')}
            onPress={() => packagePhotoHandler([1, 1])}
            photoType="package"
          />
          <NoCodePhotoButton
            title={t('Foto da fachada')}
            onPress={() => packagePhotoHandler([1, 1])}
            photoType="front"
          />
        </View>
        <View style={{ flex: 1 }} />
        <DefaultButton
          title={t('Confirmar entrega')}
          onPress={() => null}
          activityIndicator={isLoading}
        />
        {/* primeira coisa: mandar a foto pro storage. ver o esquema da selfie */}
        {/* <View style={{ flex: 1 }} />
        <IconMotocycle />
        <Text style={{ ...texts.x2l }}>{t('Escolha o motivo da confirmação sem código:')}</Text>
        <View style={{ marginTop: padding }}>
          {issues?.map((issue) => (
            <RadioButton
              key={issue.id}
              title={issue.title}
              onPress={() => setSelectedIssue(issue)}
              checked={selectedIssue?.id === issue.id}
              style={{ marginBottom: padding }}
            />
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <DefaultButton
          title={t('Confirmar entrega')}
          onPress={confirmHandler}
          disabled={isLoading || !selectedIssue}
          activityIndicator={isLoading}
        /> */}
      </PaddedView>
    </ScrollView>
  );
};
