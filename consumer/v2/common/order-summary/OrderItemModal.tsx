import { MaterialIcons } from '@expo/vector-icons';
import { Order, OrderItem, WithId } from 'appjusto-types';
import React from 'react';
import { Modal, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import Api from '../../../../common/store/api/api';
import * as helpers from '../../../../common/store/api/order/helpers';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ItemQuantity } from '../../food/restaurant/product/ItemQuantity';

type Props = {
  onEditItemPress: (productId: string, itemId: string) => void;
  order: WithId<Order>;
  modalVisible: boolean;
  item: OrderItem;
  api: Api;
  onOpenModal?: () => void;
};

export const OrderItemModal = ({
  modalVisible,
  item,
  order,
  api,
  onOpenModal,
  onEditItemPress,
}: Props) => {
  // state
  const [quantity, setQuantity] = React.useState(item.quantity);
  // handlers
  // check if it is working correctly
  // const updateQuantity = () => {
  //   (async () => {
  //     const updatedOrder = !item.id
  //       ? helpers.addItemToOrder(order, item)
  //       : quantity > 0
  //       ? helpers.updateItem(order, item)
  //       : helpers.removeItem(order, item);
  //     api.order().updateOrder(order.id, updatedOrder);
  //   })();
  // };
  const removeItem = () => {
    (async () => {
      const updatedOrder = helpers.removeItem(order, item);
      await api.order().updateOrder(order.id, updatedOrder);
    })();
  };
  console.log(order.items);
  return (
    <Modal animationType="fade" visible={modalVisible} transparent>
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', flex: 1 }}>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            paddingHorizontal: padding,
            paddingTop: padding,
            marginTop: 'auto',
            borderColor: colors.grey500,
            borderWidth: 1,
          }}
        >
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={onOpenModal}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...borders.default,
                  borderColor: colors.green500,
                  backgroundColor: colors.green500,
                  // alignSelf: 'flex-end',
                }}
              >
                <MaterialIcons name="close" size={16} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ ...texts.xl, marginBottom: padding }}>{item.product.name}</Text>
          {item.complements?.map((complement) => (
            <Text style={{ ...texts.sm, color: colors.grey700 }} key={complement.complementId}>
              {complement.name}
            </Text>
          ))}
          <View>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Observações:')}</Text>
            <View style={{ ...borders.default, height: 66, padding, marginTop: halfPadding }}>
              <Text style={{ ...texts.sm, color: colors.grey700, flexWrap: 'wrap' }}>
                {item.notes ?? ''}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <TouchableOpacity onPress={() => onEditItemPress(item.product.id, item.id)}>
              <RoundedText>{t('Revisar detalhes do item')}</RoundedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={removeItem} style={{ marginLeft: padding }}>
              <RoundedText color={colors.red}>{t('Remover')}</RoundedText>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }} />
          <View>
            <HR />
            <ItemQuantity
              style={{ marginVertical: padding }}
              value={quantity}
              minimum={item.id ? 0 : 1}
              title={`${t('Atualizar')} ${formatCurrency(helpers.getItemTotal(item!))}`}
              disabled={false}
              onChange={(value) => setQuantity(value)}
              onSubmit={() => null}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
