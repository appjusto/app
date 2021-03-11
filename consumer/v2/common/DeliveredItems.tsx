import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import { colors, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';

interface Props {
  order: WithId<Order>;
}

export const DeliveredItems = ({ order }: Props) => {
  return (
    <View>
      <SingleHeader title={order.business?.name ?? ''} />
      <HR />
      {order.items?.map((item) => (
        <View key={item.id}>
          <View style={{ paddingHorizontal: padding, paddingVertical: 12 }}>
            <Text style={[texts.sm]}>{item.product.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...texts.xs, color: colors.green500 }}>{`${item.quantity}x `}</Text>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {formatCurrency(item.product.price)}
              </Text>
            </View>
            {item.complements?.map((complement) => (
              <View key={complement.complementId}>
                <Text style={{ ...texts.xs, color: colors.grey700 }}>{`+ ${complement.name}`}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{ ...texts.xs, color: colors.green500 }}
                  >{`${item.quantity}x `}</Text>
                  <Text style={{ ...texts.xs, color: colors.grey700 }}>
                    {formatCurrency(complement.price)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <HR />
        </View>
      ))}
    </View>
  );
};
