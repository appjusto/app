import React from 'react';
import { View, Text } from 'react-native';

import { OrderStatus } from '../../common/store/order/types';
import { texts, borders, colors } from '../../common/styles';
import { t } from '../../strings';

const getStatusLabel = (status: OrderStatus) => {
  if (status === OrderStatus.Quote) return t('Cotação');
  if (status === OrderStatus.Matching) return t('Aguardando');
  if (status === OrderStatus.Dispatching) return t('Em andamento');
  if (status === OrderStatus.Delivered) return t('Entregue');
  if (status === OrderStatus.Canceled) return t('Cancelado');
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
