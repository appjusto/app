import { OrderItem } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { borders, colors, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';

interface Props extends ViewProps {
  item: OrderItem;
}

export const OrderListItem = ({ item }: Props) => {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        paddingVertical: 12,
        paddingRight: padding,
        paddingLeft: 24,
        flexDirection: 'row',
        alignItems: 'center',
        ...borders.default,
        borderRadius: 0,
      }}
    >
      <View style={{ width: '12%', alignItems: 'flex-start' }}>
        <Text style={{ ...texts.sm }}>{item.quantity}</Text>
      </View>
      <View style={{ width: '61%', alignItems: 'flex-start' }}>
        <Text style={[texts.sm, texts.bold]}>{item.product.categoryName}</Text>
        <Text style={[texts.sm]}>{item.product.name}</Text>
        {/* <Text style={[texts.sm, { color: colors.red }]}>{item.notes}</Text> */}
        <Text style={[texts.sm, { color: colors.red }]}>
          Experimentando um texto longo para ver como fica no componente. Se ele for muito grande,
          será que quebra?
        </Text>
      </View>
      <View style={{ width: '27%', alignItems: 'flex-end' }}>
        <Text style={{ ...texts.sm }}>{formatCurrency(item.product.price * item.quantity)}</Text>
      </View>
      {/* what about the complements? */}
    </View>
  );
};
