import { Order } from 'appjusto-types';
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
  if (order.type === 'p2p' && order.dispatchingState !== 'arrived-destination') {
    header = t('Pedido Confirmado!');
  }
  return (
    <View style={{ paddingHorizontal: padding, alignItems: 'center', paddingBottom: padding }}>
      {order.status === 'dispatching' && order.dispatchingState === 'arrived-destination' ? (
        <IconMotocycle />
      ) : (
        <IconOngoingRequest />
      )}
      <Text style={{ marginTop: padding, ...texts.xl }}>{header}</Text>
      {order.type === 'food' && (
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
      )}
      {/* {order.type === 'p2p' && order.status === 'confirmed' && (
        <Text
          style={{
            ...texts.md,
            color: colors.grey700,
            textAlign: 'center',
            marginTop: halfPadding,
          }}
        >
          {t('Pedido: ')} {order.code}
        </Text>
      )} */}
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
