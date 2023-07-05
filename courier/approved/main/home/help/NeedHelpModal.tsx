import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Linking, Modal, ModalProps, Pressable, Text, View } from 'react-native';
import { track } from '../../../../../common/store/api/track';
import { biggerPadding, colors, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../../../strings/values';
import { DeliveryProblemCard } from '../../../ongoing/delivery-problem/DeliveryProblemCard';

interface Props extends ModalProps {
  onClose: () => void;
}

export const NeedHelpModal = ({ onClose, ...props }: Props) => {
  return (
    <Modal transparent {...props}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column-reverse',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: padding,
            paddingVertical: biggerPadding,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.xl }}>Como podemos ajudar?</Text>
            <Pressable onPress={onClose}>
              <Feather size={28} name="x" />
            </Pressable>
          </View>
          <DeliveryProblemCard
            title={t('Falar com nosso time')}
            subtitle={t('Envia uma mensagem para o nosso WhatsApp')}
            onPress={() => {
              track('Falar com atendente', { screen: 'NeedHelpModal' });
              Linking.openURL(AppJustoAssistanceWhatsAppURL);
            }}
            situation="chat"
          />
          <DeliveryProblemCard
            title={t('Realizar uma denúncia')}
            subtitle={t('Se você sofreu algum tipo de discriminação')}
            onPress={() => {}}
            situation="courier-problem"
          />
        </View>
      </View>
    </Modal>
  );
};
