import { OrderStatus } from 'appjusto-types';
import React from 'react';
import { t } from '../../../strings';
import { colors } from '../../styles';
import RoundedText from '../texts/RoundedText';

const getStatusLabel = (status: OrderStatus) => {
  if (status === 'quote') return t('Cotação');
  if (status === 'confirming') return t('Confirmando...');
  if (status === 'confirmed') return t('Confirmado');
  if (status === 'ready') return t('Aguardando entregador');
  if (status === 'preparing') return t('Preparando');
  if (status === 'dispatching') return t('Saiu para entrega');
  if (status === 'delivered') return t('Entregue');
  if (status === 'canceled') return t('Cancelado');
  return '';
};

type Props = {
  status: OrderStatus;
};

export default function ({ status }: Props) {
  let backgroundColor = colors.white;
  if (status === 'confirming' || status === 'dispatching') backgroundColor = colors.yellow;
  else if (status === 'canceled') backgroundColor = colors.lightRed;
  return <RoundedText backgroundColor={backgroundColor}>{getStatusLabel(status)}</RoundedText>;
}
