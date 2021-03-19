import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import HR from '../../../../common/components/views/HR';
import { colors, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { OrderItemModal } from './OrderItemModal';

interface Props {
  order: WithId<Order>;
  modalVisible: boolean;
  onEditItemPress: (productId: string, itemId: string) => void;
  onAddItemsPress: () => void;
  onModalClose: () => void;
}

export const OrderItems = ({
  order,
  modalVisible,
  onEditItemPress,
  onAddItemsPress,
  onModalClose,
}: Props) => {
  return (
    <View>
      <SingleHeader title={t('Revise seu pedido')} />
      <HR />
      {order.items?.map((item) => (
        <View key={item.id}>
          <TouchableOpacity
            // onPress={() => onEditItemPress(item.product.id, item.id)}
            onPress={onModalClose}
          >
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
                  <Text
                    style={{ ...texts.xs, color: colors.grey700 }}
                  >{`+ ${complement.name}`}</Text>
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
          </TouchableOpacity>
          <OrderItemModal
            item={item}
            visible={modalVisible}
            order={order}
            onModalClose={onModalClose}
            onEditItemPress={() => onEditItemPress(item.product.id, item.id)}
          />
        </View>
      ))}
      <View>
        <TouchableOpacity onPress={onAddItemsPress}>
          <Text
            style={{
              ...texts.sm,
              paddingHorizontal: padding,
              paddingVertical: 12,
              color: colors.green600,
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
