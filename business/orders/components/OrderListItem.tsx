import { OrderItem } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';

interface Props extends ViewProps {
  item: OrderItem;
}

export const OrderListItem = ({ item }: Props) => {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        ...borders.default,
        borderRadius: 0,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 12,
          paddingRight: padding,
          paddingLeft: 24,
        }}
      >
        <View style={{ width: '12%', alignItems: 'flex-start' }}>
          <Text style={{ ...texts.sm }}>{item.quantity}</Text>
        </View>
        <View style={{ width: '61%', alignItems: 'flex-start' }}>
          <Text style={[texts.sm, texts.bold]}>{item.product.categoryName}</Text>
          <Text style={[texts.sm]}>{item.product.name}</Text>
          {item.notes ? <Text style={[texts.sm, { color: colors.red }]}>{item.notes}</Text> : null}
        </View>
        <View style={{ width: '27%', alignItems: 'flex-end' }}>
          <Text style={{ ...texts.sm }}>{formatCurrency(item.product.price * item.quantity)}</Text>
        </View>
        {/*complements */}
      </View>
      <View
        style={{
          paddingBottom: 12,
          paddingRight: padding,
          paddingLeft: 24,

          marginTop: halfPadding,
        }}
      >
        {item.complements?.map((complement) => (
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}
            key={complement.complementId}
          >
            <View style={{ width: '12%', alignItems: 'flex-start' }}>
              <Text style={{ ...texts.sm, color: colors.grey700 }}>{complement.quantity}</Text>
            </View>
            <View style={{ width: '61%', alignItems: 'flex-start' }}>
              <Text
                style={[texts.sm, { color: colors.grey700, flexWrap: 'wrap' }]}
                numberOfLines={3}
              >
                {complement.group.name} - {complement.name}
              </Text>
            </View>
            <View style={{ width: '27%', alignItems: 'flex-end' }}>
              <Text style={{ ...texts.sm, color: colors.grey700 }}>
                {formatCurrency(complement.price * complement.quantity)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
