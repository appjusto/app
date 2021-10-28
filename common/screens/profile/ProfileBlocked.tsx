import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, View } from 'react-native';
import { useSelector } from 'react-redux';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { ProfileIssuesParamsList } from '../../../courier/ProfileIssuesNavigator';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import FeedbackView from '../../components/views/FeedbackView';
import { IconConeYellow } from '../../icons/icon-cone-yellow';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';

type ScreenNavigationProp = StackNavigationProp<
  UnapprovedParamList & ProfileIssuesParamsList,
  'ProfileBlocked'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // redux
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const flavor = useSelector(getFlavor);
  const profile = flavor === 'consumer' ? consumer! : courier!;
  // side effects
  // tracking
  useSegmentScreen('ProfileBlocked');
  // helpers
  const header = (() => {
    if (flavor === 'courier' && profile.situation === 'deleted')
      return t('Seu cadastro foi deletado :(');
    else return t('Seu cadastro está bloqueado :(');
  })();
  // UI
  return (
    <FeedbackView
      header={header}
      description={profile?.profileIssues?.join('\n') ?? t('Entre em contato com nosso suporte.')}
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
    </FeedbackView>
  );
}
