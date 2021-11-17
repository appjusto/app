import { DispatchingState, Order, OrderStatus } from '@appjusto/types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { t } from '../../../strings';
import { isOrderOngoing } from '../../store/order/selectors';
import { colors, halfPadding } from '../../styles';
import RoundedText from '../texts/RoundedText';

const getStatusLabel = (status: OrderStatus, dispatchingState: DispatchingState) => {
  if (status === 'quote') return t('Continuar pedido');
  if (status === 'confirming' || status === 'charged') return t('Confirmando...');
  if (status === 'confirmed') return t('Confirmado');
  if (status === 'preparing') return t('Preparando');
  if (status === 'delivered') return t('Entregue');
  if (status === 'canceled') return t('Cancelado');
  if (status === 'declined') return t('Não aprovado');
  // status must be ready or dispatching at this point
  if (dispatchingState === 'going-destination') return t('Saiu para entrega');
  if (dispatchingState === 'arrived-destination') return t('Chegou no destino');
  // possible dispatchingState here: 'idle' 'matching', 'going-pickup', 'arrived-pickup', 'unmatched'
  return t('Aguardando entregador/a');
};

type Props = {
  order: Order;
  onRemove?: () => void;
};

export default function ({ order, onRemove }: Props) {
  const { status, dispatchingState } = order;
  let backgroundColor = colors.white;
  let color = colors.black;
  let noBorder = false;
  if (isOrderOngoing(order)) backgroundColor = colors.yellow;
  else if (status === 'canceled') {
    backgroundColor = colors.grey700;
    color = colors.white;
  } else if (status === 'quote') {
    backgroundColor = colors.green500;
    noBorder = true;
  }
  return status !== 'quote' ? (
    <RoundedText backgroundColor={backgroundColor} color={color} noBorder={noBorder}>
      {getStatusLabel(status, dispatchingState!)}
    </RoundedText>
  ) : (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <RoundedText backgroundColor={backgroundColor} color={color} quote>
        {getStatusLabel(status, dispatchingState!)}
      </RoundedText>
      <TouchableOpacity onPress={onRemove} style={{ marginLeft: halfPadding }}>
        <RoundedText color={colors.red}>{t('Remover')}</RoundedText>
      </TouchableOpacity>
    </View>
  );
}
