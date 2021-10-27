import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { UnapprovedConsumerParamsList } from '../../../consumer/v2/UnapprovedConsumerNavigator';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { ProfileIssuesParamsList } from '../../../courier/ProfileIssuesNavigator';
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
  UnapprovedConsumerParamsList & ProfileIssuesParamsList,
  'CommonProfileRejected'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const CommonProfileRejected = ({ navigation }: Props) => {
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
  // helpers
  const profile = flavor === 'courier' ? courier! : consumer!;
  const description = (() => {
    if (profile.profileIssues) return profile.profileIssues.join('\n');
    else return t('Entre em contato com nosso suporte.');
  })();
  // handler
  const updateCourierProfileHandler = () => {
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
    <FeedbackView
      header={t('Seu cadastro foi recusado :(')}
      description={description}
      icon={<IconConeYellow />}
    >
      {flavor === 'courier' ? (
        <DefaultButton
          title={t('Editar cadastro')}
          onPress={updateCourierProfileHandler}
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
