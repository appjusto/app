import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import { colors, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';

interface Props {
  order: WithId<Order>;
}

export const DeliveredItems = ({ order }: Props) => {
  return (
    <View>
      <SingleHeader title={t('Detalhes do pedido')} />
      <HR />
      {order.items?.map((item) => (
        <View key={item.id}>
          <View style={{ paddingHorizontal: padding, paddingVertical: 12 }}>
            <Text style={[texts.sm]}>{item.product.name}</Text>
            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
              <Text style={{ ...texts.xs, color: colors.green500 }}>{`${item.quantity}x `}</Text>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {formatCurrency(item.product.price)}
              </Text>
            </View>
            {item.complements ? (
              <View>
                {item.complements?.map((complement) => (
                  <View key={complement.complementId}>
                    <Text
                      style={{ ...texts.xs, color: colors.grey700 }}
                    >{`+ ${complement.name}`}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                      <Text
                        style={{ ...texts.xs, color: colors.green500 }}
                      >{`${complement.quantity}x `}</Text>
                      <Text style={{ ...texts.xs, color: colors.grey700 }}>
                        {formatCurrency(complement.price)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
          <HR />
        </View>
      ))}
    </View>
  );
};
