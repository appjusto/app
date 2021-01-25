import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import HR from '../../../../common/components/views/HR';
import { colors, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import SingleHeader from '../../restaurants/SingleHeader';

interface Props {
  order: WithId<Order>;
}

export const OrderItems = ({ order }: Props) => {
  return (
    <View>
      <SingleHeader title={order.business?.name ?? ''} />
      <HR />
      {order.items?.map((item) => (
        <View key={item.product.id}>
          <View style={{ paddingHorizontal: padding, paddingVertical: 12 }}>
            <Text style={[texts.default]}>{item.product.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...texts.small, color: colors.green }}>{`${item.quantity}x `}</Text>
              <Text style={{ ...texts.small, color: colors.grey }}>
                {formatCurrency(item.product.price)}
              </Text>
            </View>
          </View>
          <HR />
        </View>
      ))}
      <View>
        <TouchableOpacity onPress={() => null}>
          <Text
            style={{
              ...texts.default,
              paddingHorizontal: padding,
              paddingVertical: 12,
              color: colors.darkGreen,
            }}
          >
            {t('+ Adicionar mais itens')}
          </Text>
          <HR />
        </TouchableOpacity>
      </View>
    </View>
  );
};
