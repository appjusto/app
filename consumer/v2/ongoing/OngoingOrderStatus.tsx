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
  const { status, dispatchingState } = order;
  let header: string | null = null;
  let description: string | null = null;

  if (status === 'confirming') {
  } else if (status === 'confirmed') {
    header = t('Pedido aprovado!');
    description =
      order.type === 'food'
        ? t('Aguarde enquanto o restaurante confirma seu pedido.')
        : t('Aguarde enquanto procuramos um entregador para você.');
  } else if (status === 'preparing') {
    header = t('Pedido em preparo');
    description = t(
      'O restaurante começou a preparar seu pedido e logo estará prontinho para você.'
    );
  } else if (status === 'ready') {
    header = t('Pronto para entrega');
    description = t('Estamos aguardando o entregador pegar o seu pedido e levá-lo até você.');
  } else if (status === 'dispatching') {
    if (dispatchingState === 'going-pickup') {
      header = order.type === 'food' ? t('Indo para o restaurante') : t('Indo para a coleta');
      description =
        order.type === 'food'
          ? t('O entregador já está indo pegar o pedido.')
          : t('O entregador está indo para o local de coleta.');
    } else if (dispatchingState === 'arrived-pickup') {
      header = order.type === 'food' ? t('Aguardando retirada') : t('Aguardando coleta');
      description =
        order.type === 'food'
          ? t('O entregador já chegou ao restaurante.')
          : t('O entregador já chegou ao local de coleta.');
    } else if (dispatchingState === 'going-destination') {
      header = t('Saiu para entrega');
      description = t('Já pode se preparar! O entregador saiu e está levando o pedido até você.');
    } else if (dispatchingState === 'arrived-destination') {
      header = t('Entregador chegou!');
      description = t('O entregador já está no local de entrega.');
    }
  } else if (status === 'delivered') {
    header = t('Pedido entregue!');
    description = '';
  } else if (status === 'canceled') {
    header = t('Pedido cancelado!');
    description = '';
  } else if (status === 'declined') {
  }
  if (header === null || description === null) return null;
  return (
    <View style={{ paddingHorizontal: padding, alignItems: 'center', paddingBottom: padding }}>
      {status === 'dispatching' && dispatchingState === 'arrived-destination' ? (
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
