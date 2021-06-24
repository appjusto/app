import React from 'react';
import { Modal, ModalProps, Text, View } from 'react-native';
import { Order, WithId } from '../../../../types';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { IconOngoingRequest } from '../../../common/icons/icon-ongoingRequest';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

export interface Props extends ModalProps {
  order: WithId<Order>;
  onWithdrawal: () => void;
}

export const WithdrawOrderModal = ({ order, onWithdrawal, ...props }: Props) => {
  return (
    <Modal transparent {...props}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          // alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            marginHorizontal: padding,
            backgroundColor: colors.white,
            padding: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ marginBottom: halfPadding }}>
            <IconOngoingRequest />
          </View>
          <Text style={{ ...texts.x2l }}>
            {order.status === 'dispatching' ? t('Retire o pedido') : t('Aguarde')}
          </Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {order.status === 'dispatching'
              ? t('Mostre essa tela para o restaurante')
              : t('O pedido está sendo finalizado')}
          </Text>
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ ...texts.xl, color: colors.grey700 }}>{t('Pedido Nº')}</Text>
            <Text style={{ ...texts.x4l }}>{order.code}</Text>
          </View>
          <View style={{ marginTop: 24, alignItems: 'center', marginBottom: 48 }}>
            <Text style={{ ...texts.xl, color: colors.grey700 }}>{t('Cliente')}</Text>
            <Text style={{ ...texts.x4l }}>{order.consumer.name}</Text>
          </View>
          <View style={{ width: '100%' }}>
            <DefaultButton
              title={order.status === 'dispatching' ? t('Recebi o pedido') : t('Aguarde')}
              onPress={onWithdrawal}
              disabled={order.status !== 'dispatching'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
