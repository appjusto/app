import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
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
  const profile = flavor === 'courier' ? courier! : consumer!;
  // state
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('CommonProfileRejected');
  // UI
  let description = '';
  let switchToPassword = false;
  if (profile.profileIssues) {
    profile.profileIssues.forEach((v) => {
      if (!isEmpty(description)) description += '\n';
      if (typeof v === 'string') description += v;
      else {
        description += v.title;
        if (v.id === 'courier-profile-invalid-phone-already-in-use') switchToPassword = true;
      }
    });
  }
  if (profile.profileIssuesMessage) {
    description += '\n' + profile.profileIssuesMessage;
  }
  if (isEmpty(description)) description = t('Entre em contato com nosso suporte.');
  // handler
  const updateCourierProfileHandler = () => {
    (async () => {
      if (!courier) return;
      try {
        if (!switchToPassword) {
          setLoading(true);
          await api.profile().updateProfile(courier.id, { situation: 'pending' });
          setLoading(false);
        } else {
          api.auth().defaultAuthMode = 'password';
          await api.auth().signOut();
        }
      } catch (error: any) {
        setLoading(false);
        Sentry.Native.captureException(error);
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  // UI
  return (
    <FeedbackView
      header={t('Seu cadastro foi recusado :(')}
      description={description}
      icon={<IconConeYellow />}
    >
      <View>
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
      {flavor === 'courier' ? (
        <DefaultButton
          title={t('Editar cadastro')}
          onPress={updateCourierProfileHandler}
          secondary
          activityIndicator={isLoading}
          disabled={isLoading}
          style={{ marginTop: padding }}
        />
      ) : null}
    </FeedbackView>
  );
};
