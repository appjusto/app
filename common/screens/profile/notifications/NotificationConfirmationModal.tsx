import React from 'react';
import { Modal, ModalProps, Text, View } from 'react-native';
import { t } from '../../../../strings';
import DefaultButton from '../../../components/buttons/DefaultButton';
import PaddedView from '../../../components/containers/PaddedView';
import { borders, colors, padding, texts } from '../../../styles';

interface Props extends ModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const NotificationConfirmationModal = ({ title, onConfirm, onCancel, ...props }: Props) => {
  // UI
  return (
    <Modal transparent {...props}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <PaddedView
          style={{ ...borders.default, backgroundColor: colors.white, borderColor: colors.grey50 }}
        >
          <Text style={{ ...texts.xl }}>{title}</Text>
          <Text style={{ ...texts.md, paddingTop: padding }}>
            {t(
              'Ao desativar o recebimento dessas mensagens, o funcionamento correto do aplicativo será impactado e você poderá não receber seu pedido corretamente.'
            )}
          </Text>
          <View
            style={{
              marginTop: padding,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <DefaultButton title={t('Desativar')} variant="danger" onPress={onConfirm} />
            <DefaultButton style={{ flex: 1 }} title={t('Manter mensagens')} onPress={onCancel} />
          </View>
        </PaddedView>
      </View>
    </Modal>
  );
};
