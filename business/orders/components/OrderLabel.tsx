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
    statusLabel = t('A confirmar');
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
      statusLabel = t('Em preparação');
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
    statusBGColor = colors.yellow;
    if (dispatchingState === 'going-destination') {
      statusLabel = t('A caminho do destino');
    }
    if (dispatchingState === 'arrived-destination') {
      statusLabel = t('Chegou no destino');
    }
  }
  if (status === 'delivered') {
    statusLabel = timestamps.delivered
      ? `${t('Concluído às')} ${formatTime(timestamps.delivered)}`
      : t('Concluído');
    statusBGColor = colors.green500;
  }
  if (status === 'canceled') {
    statusLabel = t('Pedido cancelado');
    statusBGColor = colors.grey700;
  }
  if (statusLabel === undefined) return null;
  return (
    <RoundedText
      backgroundColor={statusBGColor}
      noBorder
      color={status === 'confirmed' || status === 'canceled' ? colors.white : colors.black}
    >
      {statusLabel}
    </RoundedText>
  );
};
