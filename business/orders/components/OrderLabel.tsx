import { Order } from '@appjusto/types';
import React from 'react';
import RoundedText from '../../../common/components/texts/RoundedText';
import { colors } from '../../../common/styles';
import { formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';

type Props = {
  order: Order;
};

export const OrderLabel = ({ order }: Props) => {
  if (!order) return null;
  const { status, dispatchingState, timestamps } = order;
  let statusLabel;
  let statusBGColor;
  if (status === 'confirmed') {
    statusLabel = t('Pendente');
    statusBGColor = colors.red;
  }
  if (status === 'preparing') {
    if (dispatchingState === 'going-pickup') {
      statusLabel = t('Entregador a caminho');
      statusBGColor = colors.yellow;
    }
    if (dispatchingState === 'arrived-pickup') {
      statusLabel = t('Entregador chegou');
      statusBGColor = colors.yellow;
    } else {
      statusLabel = t('Preparação');
      statusBGColor = colors.grey500;
    }
  }
  if (status === 'ready') {
    if (dispatchingState === 'going-pickup') {
      statusLabel = t('Entregador a caminho');
      statusBGColor = colors.yellow;
    }
    if (dispatchingState === 'arrived-pickup') {
      statusLabel = t('Entregador chegou');
      statusBGColor = colors.yellow;
    } else {
      statusLabel = t('Pedido pronto');
      statusBGColor = colors.green500;
    }
  }
  if (status === 'dispatching') {
    statusLabel = timestamps.dispatching
      ? `${t('Despachado às')} ${formatTime(timestamps.dispatching)}`
      : t('Despachado');
    statusBGColor = colors.green100;
  }
  if (status === 'delivered') {
    statusLabel = timestamps.delivered
      ? `${t('Concluído às')} ${formatTime(timestamps.delivered)}`
      : t('Concluído');
    statusBGColor = colors.green500;
  }
  if (statusLabel === undefined) return null;
  return (
    <RoundedText
      backgroundColor={statusBGColor}
      noBorder
      color={order.status === 'confirmed' ? colors.white : colors.black}
    >
      {statusLabel}
    </RoundedText>
  );
};
