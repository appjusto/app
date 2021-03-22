import { Order } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../common/components/texts/RoundedText';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { IconRequest } from '../../../common/icons/icon-requests';
import { colors, padding, texts } from '../../../common/styles';
import { formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';

interface Props {
  order: Order;
}

export const OngoingOrderStatus = ({ order }: Props) => {
  let header = t('Pedido confirmado!');
  let description = t('O restaurante já está com seu pedido e em breve iniciará o preparo.');
  if (order.status === 'preparing') {
    header = t('Pedido em preparo');
    description = t(
      'O restaurante começou a preparar seu pedido e logo estará prontinho para você.'
    );
  } else if (order.status === 'ready') {
    header = t('Pronto para entrega');
    description = t('Estamos aguardando o entregador pegar o seu pedido e levá-lo até você.');
  } else if (order.status === 'dispatching') {
    header = t('Saiu para entrega');
    description = t('Já pode se preparar! O entregador saiu e está levando o pedido até você. ');
  }
  if (order.status === 'dispatching' && order.dispatchingState === 'arrived-destination') {
    header = t('Entregador chegou no local');
    description = t('Aguardando o cliente para retirada.');
  }
  if (order.type === 'p2p') {
    header = t('Pedido Confirmado!');
  }
  return (
    <View style={{ padding, alignItems: 'center' }}>
      {order.status === 'dispatching' && order.dispatchingState === 'arrived-destination' ? (
        <IconMotocycle />
      ) : (
        <IconRequest />
      )}
      <Text style={{ marginTop: padding, ...texts.xl }}>{header}</Text>
      {order.type === 'food' && (
        <Text style={{ ...texts.md, color: colors.grey700, textAlign: 'center' }}>
          {description}
        </Text>
      )}
      {order.destination?.estimatedTimeOfArrival &&
        order.dispatchingState !== 'arrived-destination' && (
          <RoundedText style={{ marginTop: padding }}>{`${t('Previsão de entrega: ')} ${formatTime(
            order.destination.estimatedTimeOfArrival
          )}`}</RoundedText>
        )}
    </View>
  );
};
