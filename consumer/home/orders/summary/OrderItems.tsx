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
  onEditItemPress: (productId: string, itemId: string) => void;
  onAddItemsPress: () => void;
}

export const OrderItems = ({ order, onEditItemPress, onAddItemsPress }: Props) => {
  return (
    <View>
      <SingleHeader title={order.business?.name ?? ''} />
      <HR />
      {order.items?.map((item) => (
        <View key={item.id}>
          <TouchableOpacity onPress={() => onEditItemPress(item.product.id, item.id)}>
            <View style={{ paddingHorizontal: padding, paddingVertical: 12 }}>
              <Text style={[texts.default]}>{item.product.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...texts.small, color: colors.green }}>{`${item.quantity}x `}</Text>
                <Text style={{ ...texts.small, color: colors.grey }}>
                  {formatCurrency(item.product.price)}
                </Text>
              </View>
              {item.complements?.map((complement) => (
                <Text
                  key={complement.complementId}
                  style={{ ...texts.small, color: colors.grey }}
                >{`${complement.name} ${formatCurrency(complement.price)}`}</Text>
              ))}
            </View>
            <HR />
          </TouchableOpacity>
        </View>
      ))}
      <View>
        <TouchableOpacity onPress={onAddItemsPress}>
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
