import { Order, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import HR from '../../../../common/components/views/HR';
import {
  borders,
  colors,
  doublePadding,
  halfPadding,
  padding,
  texts,
} from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { OrderItemModal } from './OrderItemModal';

interface Props {
  order: WithId<Order>;
  onEditItemPress: (productId: string, itemId: string) => void;
  onAddItemsPress: () => void;
}

export const OrderItems = ({ order, onEditItemPress, onAddItemsPress }: Props) => {
  // state
  const [selectedItem, setSelectedItem] = React.useState<string>();
  // UI
  return (
    <View>
      <SingleHeader title={t('Revise seu pedido')} />
      <HR />
      {order.items?.map((item) => (
        <View key={item.id}>
          <TouchableOpacity onPress={() => setSelectedItem(item.id)}>
            <View style={{ padding }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      backgroundColor: colors.green700,
                      width: 25,
                      height: 25,
                      borderRadius: 25 / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors.white }}>{item.quantity}</Text>
                  </View>
                  <View style={{ marginLeft: halfPadding }}>
                    <Text style={{ ...texts.sm, color: colors.green700 }}>{item.product.name}</Text>
                    <Text style={{ ...texts.x2s, ...texts.bold, color: colors.green700 }}>{`${
                      item.quantity
                    }x ${formatCurrency(item.product.price)}`}</Text>
                  </View>
                </View>
                <Feather
                  name="edit-3"
                  size={12}
                  style={{ ...borders.default, borderColor: colors.grey50, padding: 8 }}
                />
              </View>
              {item.complements?.map((complement) => (
                <View
                  key={complement.complementId}
                  style={{
                    marginLeft: doublePadding,
                    marginTop: halfPadding,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colors.grey500,
                      width: 25,
                      height: 25,
                      borderRadius: 25 / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors.white }}>
                      {complement.quantity * item.quantity}
                    </Text>
                  </View>
                  <View style={{ marginLeft: halfPadding }}>
                    <Text style={{ ...texts.sm, color: colors.green700 }}>{complement.name}</Text>
                    <Text style={{ ...texts.x2s, ...texts.bold, color: colors.green700 }}>{`${
                      complement.quantity * item.quantity
                    }x ${formatCurrency(complement.price)}`}</Text>
                  </View>
                </View>
                // <View key={complement.complementId}>
                //   <Text
                //     style={{ ...texts.xs, color: colors.grey700 }}
                //   >{`+ ${complement.name}`}</Text>
                //   <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                //     <Text style={{ ...texts.xs, color: colors.green600 }}>{`${
                //       complement.quantity * item.quantity
                //     }x `}</Text>
                //     <Text style={{ ...texts.xs, color: colors.grey700 }}>
                //       {formatCurrency(complement.price)}
                //     </Text>
                //   </View>
                // </View>
              ))}
            </View>
            <HR />
          </TouchableOpacity>
          <OrderItemModal
            item={item}
            visible={selectedItem === item.id}
            order={order}
            onModalClose={() => setSelectedItem(undefined)}
            onEditItemPress={() => onEditItemPress(item.product.id, item.id)}
          />
        </View>
      ))}
      <View>
        <TouchableOpacity onPress={onAddItemsPress}>
          <Text
            style={{
              ...texts.sm,
              backgroundColor: colors.yellow,
              paddingHorizontal: padding,
              paddingVertical: 12,
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
