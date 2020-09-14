import { OrderStatus } from 'appjusto-types';
import React from 'react';
import { View, Text } from 'react-native';

import { texts, borders, colors } from '../../common/styles';
import { t } from '../../strings';

const getStatusLabel = (status: OrderStatus) => {
  if (status === 'quote') return t('Cotação');
  if (status === 'matching') return t('Aguardando');
  if (status === 'dispatching') return t('Em andamento');
  if (status === 'delivered') return t('Entregue');
  if (status === 'canceled') return t('Cancelado');
};

type Props = {
  status: OrderStatus;
};

export default function ({ status }: Props) {
  return (
    <View
      style={{
        ...borders.default,
        borderColor: colors.black,
        backgroundColor: colors.yellow,
        height: 24,
      }}
    >
      <Text style={[texts.small]}>{getStatusLabel(status)}</Text>
    </View>
  );
}
