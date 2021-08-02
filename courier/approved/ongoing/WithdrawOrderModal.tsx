import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native';
import { Order, WithId } from '../../../../types';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { IconOngoingRequest } from '../../../common/icons/icon-ongoingRequest';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

export interface Props extends ModalProps {
  order: WithId<Order>;
  onWithdrawal: () => void;
  onIssue: () => void;
  onModalClose: () => void;
}

export const WithdrawOrderModal = ({
  order,
  onWithdrawal,
  onIssue,
  onModalClose,
  ...props
}: Props) => {
  const title = (() => {
    if (order.status === 'dispatching') {
      return t('Retire o pedido');
    } else if (order.status === 'ready') {
      return t('Aguardando retirada');
    } else {
      return t('Aguarde');
    }
  })();
  const subTitle = (() => {
    if (order.status === 'dispatching' || order.status === 'ready') {
      return t('Mostre essa tela para o restaurante');
    } else {
      return t('O pedido está sendo finalizado');
    }
  })();
  return (
    <Modal transparent {...props}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            marginHorizontal: padding,
            backgroundColor: colors.white,
            padding,
          }}
        >
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...borders.default,
                }}
              >
                <MaterialIcons name="close" size={16} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ marginBottom: halfPadding }}>
              <IconOngoingRequest />
            </View>
            <Text style={{ ...texts.xl, color: colors.grey700 }}>{title}</Text>
            <Text style={{ ...texts.x2l, textAlign: 'center' }}>{order.business?.name}</Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{subTitle}</Text>
            <View style={{ marginTop: padding, alignItems: 'center' }}>
              <Text style={{ ...texts.xl, color: colors.grey700 }}>{t('Pedido Nº')}</Text>
              <Text style={{ ...texts.x4l }}>{order.code}</Text>
            </View>
            <View style={{ marginTop: padding, alignItems: 'center', marginBottom: padding }}>
              <Text style={{ ...texts.xl, color: colors.grey700 }}>{t('Cliente')}</Text>
              <Text style={{ ...texts.x4l }}>{order.consumer.name}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <DefaultButton
                title={order.status === 'dispatching' ? t('Recebi o pedido') : t('Aguarde')}
                onPress={onWithdrawal}
                disabled={order.status !== 'dispatching'}
              />
              <DefaultButton
                title={t('Tive um problema')}
                onPress={onIssue}
                secondary
                style={{ marginTop: halfPadding }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
