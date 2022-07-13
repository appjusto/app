import React from 'react';
import { Linking, View } from 'react-native';
import p2pJson from '../../../../../assets/lottie-icons/p2p.json';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { Lottie } from '../../../../../common/components/icons/Lottie';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { track } from '../../../../../common/store/api/track';
import { colors, padding } from '../../../../../common/styles';
import { DeliveryProblemCard } from '../../../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { t } from '../../../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../../../strings/values';

interface Props {
  onCancel: () => void;
}

export const OrderConfirmingCreditP2P = ({ onCancel }: Props) => {
  return (
    <FeedbackView
      header={t('Procurando um entregador')}
      description={t(
        'Você sabia que o AppJusto não fica com nada do valor da entrega? Ao pedir pelo AppJusto, você ajuda esse entregador a receber mais por seu trabalho. Justo, né?'
      )}
      icon={<Lottie animationObject={p2pJson} iconStyle={{ width: 114, height: 114 }} />}
      background={colors.white}
    >
      <View style={{ marginBottom: padding }}>
        <DeliveryProblemCard
          title={t('Preciso falar com o AppJusto')}
          subtitle={t('Abrir chat no WhatsApp')}
          onPress={() => {
            track('clicked to open chat with backoffice');
            Linking.openURL(AppJustoAssistanceWhatsAppURL);
          }}
          situation="chat"
        />
      </View>
      <DefaultButton title={t('Cancelar pedido')} onPress={onCancel} variant="danger" />
    </FeedbackView>
  );
};
