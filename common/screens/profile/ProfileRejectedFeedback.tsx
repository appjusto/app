import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking } from 'react-native';
import { UnapprovedConsumerParamsList } from '../../../consumer/v2/UnapprovedConsumerNavigator';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import DefaultButton from '../../components/buttons/DefaultButton';
import FeedbackView from '../../components/views/FeedbackView';
import { IconConeYellow } from '../../icons/icon-cone-yellow';
import { track } from '../../store/api/track';
import { padding } from '../../styles';

type ScreenNavigationProp = StackNavigationProp<
  UnapprovedConsumerParamsList,
  'ProfileRejectedFeedback'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const ProfileRejectedFeedback = ({ navigation }: Props) => {
  return (
    <FeedbackView
      icon={<IconConeYellow />}
      header={t('Fotos enviadas')}
      description={t('Aguarde enquanto analisamos os documentos')}
    >
      <DeliveryProblemCard
        title={t('Falar com o AppJusto')}
        subtitle={t('Abrir chat no WhatsApp')}
        onPress={() => {
          track('opening whatsapp chat with backoffice');
          Linking.openURL(AppJustoAssistanceWhatsAppURL);
        }}
        situation="chat"
      />
      <DefaultButton
        title={t('Avançar')}
        onPress={() => navigation.navigate('CommonProfileRejected')}
        style={{ marginBottom: padding }}
      />
    </FeedbackView>
  );
};
