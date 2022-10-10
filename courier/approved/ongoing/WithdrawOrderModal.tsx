import { Order, WithId } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { ModalToast } from '../../../common/components/views/ModalToast';
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
  const { status, type } = order;
  const title = (() => {
    if (status === 'dispatching') {
      return t('Retire o pedido');
    }
    if (status === 'ready') {
      return t('Aguardando retirada');
    }
    if (status === 'preparing') {
      return t('Aguarde o pedido');
    } else return t('Aguarde');
  })();
  const subTitle = (() => {
    if (status === 'dispatching' || status === 'ready') {
      return t('Mostre essa tela para o restaurante');
    } else {
      return t('O pedido está sendo finalizado');
    }
  })();
  const name = (() => {
    if (type === 'food') return order.business?.name;
    else return order.origin?.address.main;
  })();
  const buttonTitle = (() => {
    if (status === 'dispatching') {
      return t('Recebi o pedido');
    }
    if (status === 'ready') {
      return t('Aguardando retirada');
    }
    if (status === 'preparing') {
      return t('Aguarde o pedido');
    } else return t('Aguarde');
  })();
  const originInstructions = order.origin?.intructions ?? order.origin?.instructions;
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
            <Text style={{ ...texts.x2l, textAlign: 'center' }}>{name}</Text>
            {type === 'p2p' ? (
              <View>
                {order.origin?.additionalInfo ? (
                  <Text style={{ ...texts.x2l, color: colors.grey700, textAlign: 'center' }}>
                    {order.origin.additionalInfo}
                  </Text>
                ) : null}
                {originInstructions ? (
                  <Text
                    style={{
                      ...texts.sm,
                      color: colors.red,
                      textAlign: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {originInstructions}
                  </Text>
                ) : null}
              </View>
            ) : (
              <View>
                <Text style={{ ...texts.sm, color: colors.grey700 }}>{subTitle}</Text>
                <View style={{ marginTop: padding, alignItems: 'center' }}>
                  <Text style={{ ...texts.xl, color: colors.grey700 }}>{t('Pedido Nº')}</Text>
                  <Text style={{ ...texts.x4l }}>{order.code}</Text>
                </View>
              </View>
            )}
            <View style={{ marginTop: padding, alignItems: 'center', marginBottom: padding }}>
              <Text style={{ ...texts.xl, color: colors.grey700 }}>{t('Cliente')}</Text>
              <Text style={{ ...texts.x4l }}>{order.consumer.name}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <DefaultButton
                title={buttonTitle}
                onPress={onWithdrawal}
                disabled={order.status !== 'dispatching'}
              />
              <DefaultButton
                title={t('Tive um problema')}
                onPress={onIssue}
                variant="danger"
                style={{ marginTop: halfPadding }}
              />
            </View>
          </View>
          <ModalToast />
        </View>
      </View>
    </Modal>
  );
};
