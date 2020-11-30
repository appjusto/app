import { OrderStatus } from 'appjusto-types';
import React from 'react';

import { t } from '../../../strings';
import { colors } from '../../styles';
import RoundedText from '../texts/RoundedText';

const getStatusLabel = (status: OrderStatus) => {
  if (status === 'quote') return t('Cotação');
  if (status === 'confirming') return t('Confirmando com restaurante');
  if (status === 'matching') return t('Procurando entregadores');
  if (status === 'dispatching') return t('Em andamento');
  if (status === 'delivered') return t('Entregue');
  if (status === 'canceled') return t('Cancelado');
  return '';
};

type Props = {
  status: OrderStatus;
};

export default function ({ status }: Props) {
  let backgroundColor = colors.white;
  if (status === 'confirming' || status === 'matching' || status === 'dispatching') backgroundColor = colors.yellow;
  else if (status === 'canceled') backgroundColor = colors.lightRed;
  return <RoundedText backgroundColor={backgroundColor}>{getStatusLabel(status)}</RoundedText>;
}
