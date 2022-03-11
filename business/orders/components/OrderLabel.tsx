import { Order } from '@appjusto/types';
import React from 'react';
import RoundedText from '../../../common/components/texts/RoundedText';
import { colors } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: Order;
};

export const OrderLabel = ({ order }: Props) => {
  if (!order) return null;
  const { status, dispatchingState } = order;
  let statusLabel;
  if (status === 'charged') statusLabel = t('Pendente');
  if (status === 'preparing') statusLabel = t('Preparação');
  if (status === 'dispatching') {
    if (dispatchingState === 'going-pickup') statusLabel = t('Entregador a caminho');
    if (dispatchingState === 'arrived-pickup') statusLabel = t('Entregador chegou');
    if (dispatchingState === 'going-destination') statusLabel = t('A caminho do destino');
    if (dispatchingState === 'arrived-destination') statusLabel = t('Chegou no destino');
  }
  if (status === 'delivered') statusLabel = t('Pedido entregue');
  let statusBGColor;
  if (status === 'charged') statusBGColor = colors.red;
  if (status === 'preparing') statusBGColor = colors.grey500;
  if (status === 'dispatching') statusBGColor = colors.yellow;
  if (status === 'delivered') statusBGColor = colors.green500;
  if (statusLabel === undefined) return null;
  return (
    <RoundedText
      backgroundColor={statusBGColor}
      noBorder
      color={order.status === 'charged' ? colors.white : colors.black}
    >
      {statusLabel}
    </RoundedText>
  );
};
