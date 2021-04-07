import { MaterialIcons } from '@expo/vector-icons';
import { Order, OrderItem, WithId } from 'appjusto-types';
import React from 'react';
import { Modal, ModalProps, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ApiContext } from '../../../../common/app/context';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import * as helpers from '../../../../common/store/api/order/helpers';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ItemQuantity } from '../../food/restaurant/product/ItemQuantity';

interface Props extends ModalProps {
  order: WithId<Order>;
  item: OrderItem;
  onModalClose: () => void;
  onEditItemPress: (productId: string, itemId: string) => void;
}

export const OrderItemModal = ({ item, order, onModalClose, onEditItemPress, ...props }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [quantity, setQuantity] = React.useState(item.quantity);
  // handlers
  const removeItem = async () => {
    const updatedOrder = helpers.removeItem(order, item);
    await api.order().updateOrder(order.id, updatedOrder);
    onModalClose();
  };
  const updateItem = async () => {
    const updatedOrder = helpers.updateItem(order, { ...item, quantity });
    await api.order().updateOrder(order.id, updatedOrder);
    onModalClose();
  };
  // UI
  return (
    <Modal
      animationType="slide"
      transparent
      {...props}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
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
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...borders.default,
                  // borderColor: colors.green500,
                  // backgroundColor: colors.green500,
                }}
              >
                <MaterialIcons name="close" size={16} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ ...texts.xl }}>{item.product.name}</Text>
          {item.complements?.map((complement) => (
            <Text
              style={{ ...texts.sm, color: colors.grey700, marginTop: padding }}
              key={complement.complementId}
            >
              {complement.name}
            </Text>
          ))}
          <Text style={{ ...texts.sm, color: colors.grey700 }}>{item.notes}</Text>
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
              minimum={1}
              title={`${t('Atualizar')} ${formatCurrency(
                helpers.getItemTotal({ ...item, quantity })
              )}`}
              disabled={false}
              onChange={setQuantity}
              onSubmit={updateItem}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
