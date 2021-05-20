import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../common/components/texts/RoundedText';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { IconOngoingRequest } from '../../../common/icons/icon-ongoingRequest';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';

interface Props {
  order: Order;
}

export const OngoingOrderStatus = ({ order }: Props) => {
  let header = t('Pedido aprovado!');
  let description =
    order.type === 'food'
      ? t('Aguarde enquanto o restaurante confirma seu pedido.')
      : t('Aguarde enquanto procuramos um entregador para você.');
  if (order.status === 'preparing') {
    header = t('Pedido em preparo');
    description = t(
      'O restaurante começou a preparar seu pedido e logo estará prontinho para você.'
    );
  }
  if (order.status === 'ready') {
    header = t('Pronto para entrega');
    description = t('Estamos aguardando o entregador pegar o seu pedido e levá-lo até você.');
  }
  if (order.status === 'dispatching' && order.dispatchingState !== 'arrived-destination') {
    header =
      order.dispatchingState === 'going-pickup' ? t('Entrega iniciada') : t('Saiu para entrega');
    description =
      order.dispatchingState === 'going-pickup'
        ? t('O entregador já está indo pegar o pedido.')
        : t('Já pode se preparar! O entregador saiu e está levando o pedido até você. ');
  }
  if (order.status === 'dispatching' && order.dispatchingState === 'arrived-destination') {
    header = t('Entregador chegou no local');
    description = t('Aguardando o cliente para retirada.');
  }
  return (
    <View style={{ paddingHorizontal: padding, alignItems: 'center', paddingBottom: padding }}>
      {order.status === 'dispatching' && order.dispatchingState === 'arrived-destination' ? (
        <IconMotocycle />
      ) : (
        <IconOngoingRequest />
      )}
      <Text style={{ marginTop: padding, ...texts.xl }}>{header}</Text>
      <Text
        style={{
          ...texts.md,
          color: colors.grey700,
          textAlign: 'center',
          marginTop: halfPadding,
        }}
      >
        {description}
      </Text>
      {order.destination?.estimatedTimeOfArrival &&
        order.dispatchingState !== 'arrived-destination' && (
          <View style={{ marginBottom: 8, marginTop: padding }}>
            <RoundedText>{`${t('Previsão de entrega: ')} ${formatTime(
              order.destination.estimatedTimeOfArrival
            )}`}</RoundedText>
          </View>
        )}
    </View>
  );
};
