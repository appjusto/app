import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { OrderListItem } from './OrderListItem';

interface Props extends ViewProps {
  order: Order;
}

export const DetailedOrderItems = ({ order, style }: Props) => {
  if (!order) return null;
  if (!order.items) return null;
  return (
    <View style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
        <View style={{ width: '17%', alignItems: 'flex-start' }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Qtde.')}</Text>
        </View>
        <View style={{ width: '56%', alignItems: 'flex-start' }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Item')}</Text>
        </View>
        <View style={{ width: '27%', alignItems: 'flex-end' }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Valor/ item')}</Text>
        </View>
      </View>
      {order.items.map((item, index) => (
        <OrderListItem item={item} key={`${index} + ${item.id}`} />
      ))}
      <View
        style={{
          backgroundColor: colors.white,
          paddingVertical: 12,
          paddingHorizontal: padding,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...borders.default,
          borderRadius: 0,
          marginTop: 4,
        }}
      >
        <Text style={{ ...texts.sm }}>{t('Valor do frete:')}</Text>
        <Text style={[texts.sm]}>{formatCurrency(order.fare!.courier.value)}</Text>
      </View>
      <View
        style={{
          backgroundColor: colors.white,
          paddingVertical: 12,
          paddingHorizontal: padding,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...borders.default,
          borderRadius: 0,
          marginTop: 4,
        }}
      >
        <Text style={{ ...texts.sm }}>{t('Valor total itens + frete:')}</Text>
        <Text style={[texts.sm, texts.bold]}>{formatCurrency(order.fare!.total)}</Text>
      </View>
    </View>
  );
};
