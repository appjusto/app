import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { halfPadding, padding, texts } from '../../../common/styles';
import { formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { OrderLabel } from './OrderLabel';

interface Props extends ViewProps {
  order: Order;
}

export const OrderDetailHeader = ({ order, style }: Props) => {
  if (!order) return null;
  return (
    <View style={style}>
      <DoubleHeader
        title={`${t('Pedido Nº ')}${order.code}`}
        subtitle={`Horário do pedido: ${formatTime(order.createdOn) ?? 'Indisponível no momento'}`}
      />
      <PaddedView>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* order.status */}
          <OrderLabel order={order} />
          {/* spacer view */}
          <View style={{ width: padding, height: padding }} />
          {/* cooking time component. status === 'preparing' */}
          {/* <RemainingTime order={order} /> */}
        </View>
        <Text style={{ ...texts.md, marginTop: halfPadding }}>
          {t('Nome do cliente: ')}
          <Text style={texts.bold}>{order.consumer.name ?? 'Indisponível no momento'}</Text>
        </Text>
      </PaddedView>
    </View>
  );
};
