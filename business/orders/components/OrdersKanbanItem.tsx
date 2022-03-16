import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderLabel } from './OrderLabel';

type Props = {
  onCheckOrder: () => void;
  onTakeOrder: () => void;
  order: WithId<Order>;
};

export const OrdersKanbanItem = ({ onCheckOrder, onTakeOrder, order }: Props) => {
  if (!order) return null;
  const { status } = order;
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: padding,
        ...borders.default,
        backgroundColor: colors.white,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          {/* order.consumer.name */}
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Daniel')}</Text>
          {/* order.code */}
          <Text style={{ ...texts.sm }}>{t('#0000')}</Text>
        </View>
        {/* "timing" component while "preparing" */}
        {status === 'preparing' ? (
          <View>
            <Text>Tempo de preparo</Text>
          </View>
        ) : null}
        {/* dispatchingStatus label */}
        <OrderLabel order={order} />
      </View>
      <View style={{ marginTop: padding, flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* if an order is already delivered, we show only on big secondary "Ver pedido" button
        instead of these two */}
        <View style={{ width: '38%' }}>
          <DefaultButton secondary title={t('Ver pedido')} onPress={onCheckOrder} />
        </View>
        {/* dynamic title and background color */}
        <View style={{ width: '57%' }}>
          <DefaultButton title={t('Aceitar pedido')} onPress={onTakeOrder} />
        </View>
      </View>
    </View>
  );
};
