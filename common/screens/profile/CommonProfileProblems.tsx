import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { UnapprovedConsumerParamsList } from '../../../consumer/v2/UnapprovedConsumerNavigator';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import { ApiContext, AppDispatch } from '../../app/context';
import DefaultButton from '../../components/buttons/DefaultButton';
import FeedbackView from '../../components/views/FeedbackView';
import { IconConeYellow } from '../../icons/icon-cone-yellow';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';
import { showToast } from '../../store/ui/actions';
import { padding } from '../../styles';

type ScreenNavigationProp = StackNavigationProp<
  UnapprovedConsumerParamsList & UnapprovedParamList,
  'CommonProfileProblems'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const CommonProfileProblems = ({ navigation }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  // state
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('CommonProfileRejected');
  // adapting to courier situation changes
  // React.useEffect(() => {
  //   if (flavor === 'courier' && courier?.situation === 'pending')
  //     //TODO: MAKE THE NAVIGATOR HANDLE THIS
  //     navigation.replace('ProfilePending');
  //   else if (flavor === 'courier' && courier?.situation === 'submitted')
  //     navigation.replace('ProfileSubmitted');
  // }, [courier?.situation, navigation, flavor]);
  // helpers
  const profile = flavor === 'consumer' ? consumer! : courier!;
  const description = (() => {
    if (flavor === 'courier') {
      if (courier?.profileIssues?.join) return courier.profileIssues?.join('\n');
      else return t('Entre em contato com nosso suporte.');
    } else return t('Entre em contato com nosso suporte.');
  })();
  const header = (() => {
    const { situation } = profile;
    if (situation === 'rejected') return t('Seu cadastro foi recusado :(');
    else if (situation === 'deleted') return t('Seu cadastro foi deletado :(');
    else if (situation === 'invalid') t('Seu cadastro está inválido :(');
  })();
  // handler
  const updateProfileHandler = () => {
    (async () => {
      if (!courier) return;
      try {
        setLoading(true);
        await api.profile().updateProfile(courier.id, { situation: 'pending' });
        track('courier situation updated to pending');
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        Sentry.Native.captureException(error);
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  return (
    <FeedbackView header={header} description={description} icon={<IconConeYellow />}>
      {flavor === 'courier' ? (
        <DefaultButton
          title={t('Editar cadastro')}
          onPress={updateProfileHandler}
          secondary
          activityIndicator={isLoading}
          disabled={isLoading}
        />
      ) : (
        <View style={{ marginBottom: padding }}>
          <DeliveryProblemCard
            title={t('Falar com o AppJusto')}
            subtitle={t('Abrir chat no WhatsApp')}
            onPress={() => {
              track('opening whatsapp chat with backoffice');
              Linking.openURL(AppJustoAssistanceWhatsAppURL);
            }}
            situation="chat"
          />
        </View>
      )}
    </FeedbackView>
  );
};
