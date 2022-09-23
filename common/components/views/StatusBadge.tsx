import { DispatchingState, Fulfillment, Order, OrderStatus, WithId } from '@appjusto/types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { t } from '../../../strings';
import { isOrderOngoing } from '../../store/order/selectors';
import { colors, halfPadding } from '../../styles';
import RoundedText from '../texts/RoundedText';

const getStatusLabel = (
  status: OrderStatus,
  dispatchingState: DispatchingState,
  fulfillment?: Fulfillment
) => {
  if (status === 'quote') return t('Continuar pedido');
  if (status === 'confirming' || status === 'charged') return t('Confirmando...');
  if (status === 'scheduled') return t('Agendado');
  if (status === 'confirmed') return t('Confirmado');
  if (status === 'preparing') return t('Preparando');
  if (status === 'delivered') {
    if (fulfillment === 'delivery') {
      return t('Entregue');
    } else if (fulfillment === 'take-away') {
      return t('Retirada efetuada');
    }
  }
  if (status === 'canceled' || status === 'rejected') return t('Cancelado');
  if (status === 'declined') return t('Não aprovado');
  // status must be ready or dispatching at this point
  if (dispatchingState === 'going-destination') return t('Saiu para entrega');
  if (dispatchingState === 'arrived-destination') return t('Chegou no destino');
  // take-away
  if (fulfillment === 'take-away' && status === 'ready') return t('Aguardando retirada');
  // possible dispatchingState here: 'idle' 'matching', 'going-pickup', 'arrived-pickup', 'unmatched'
  return t('Aguardando entregador/a');
};

type Props = {
  order: WithId<Order>;
  onRemove?: () => void;
};

export default function ({ order, onRemove }: Props) {
  const { status, dispatchingState, fulfillment } = order;
  let backgroundColor = colors.white;
  let color = colors.black;
  let noBorder = false;
  if (isOrderOngoing(order)) backgroundColor = colors.yellow;
  else if (status === 'canceled' || status === 'rejected') {
    backgroundColor = colors.grey700;
    color = colors.white;
  } else if (status === 'quote') {
    backgroundColor = colors.green500;
    noBorder = true;
  }
  if (status === 'quote')
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RoundedText backgroundColor={backgroundColor} color={color} quote>
          {getStatusLabel(status, dispatchingState!, fulfillment)}
        </RoundedText>
        <TouchableOpacity onPress={onRemove} style={{ marginLeft: halfPadding }}>
          <RoundedText color={colors.red}>{t('Remover')}</RoundedText>
        </TouchableOpacity>
      </View>
    );
  return (
    <RoundedText backgroundColor={backgroundColor} color={color} noBorder={noBorder}>
      {getStatusLabel(status, dispatchingState!, fulfillment)}
    </RoundedText>
  );
}
