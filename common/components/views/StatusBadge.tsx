import { DispatchingState, Order, OrderStatus } from 'appjusto-types';
import React from 'react';
import { t } from '../../../strings';
import { isOrderOngoing } from '../../store/order/selectors';
import { colors } from '../../styles';
import RoundedText from '../texts/RoundedText';

const getStatusLabel = (status: OrderStatus, dispatchingState: DispatchingState) => {
  if (status === 'quote') return t('Cotação');
  if (status === 'confirming') return t('Confirmando...');
  if (status === 'confirmed') return t('Confirmado');
  if (status === 'preparing') return t('Preparando');
  if (status === 'delivered') return t('Entregue');
  if (status === 'canceled') return t('Cancelado');
  if (status === 'declined') return t('Não aprovado');
  // status must be ready or dispatching at this point
  if (dispatchingState === 'going-destination') return t('Saiu para entrega');
  if (dispatchingState === 'arrived-destination') return t('Chegou no destino');
  // possible dispatchingState here: 'idle' 'matching', 'going-pickup', 'arrived-pickup', 'unmatched'
  return t('Aguardando entregador');
};

type Props = {
  order: Order;
};

export default function ({ order }: Props) {
  const { status, dispatchingState } = order;
  let backgroundColor = colors.white;
  if (isOrderOngoing(order)) backgroundColor = colors.yellow;
  else if (status === 'canceled') backgroundColor = colors.lightRed;
  return (
    <RoundedText backgroundColor={backgroundColor}>
      {getStatusLabel(status, dispatchingState)}
    </RoundedText>
  );
}
