import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import RoundedText from '../../../common/components/texts/RoundedText';
import ArrowBox from '../../../common/components/views/ArrowBox';
import StatusBadge from '../../../common/components/views/StatusBadge';
import { useDeliveryLedgerEntry } from '../../../common/store/api/courier/account/useDeliveryLedgerEntry';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { getOrderTime } from '../../../common/store/order/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import {
  formatCurrency,
  formatDate,
  formatTime,
  separateWithDot,
} from '../../../common/utils/formatters';

type Props = {
  orderId: string;
  onPress: () => void;
};

export const DeliveryHistoryCard = ({ orderId, onPress }: Props) => {
  const navigation = useNavigation();
  // screen state
  const order = useObserveOrder(orderId);
  const ledgerEntry = useDeliveryLedgerEntry(orderId);
  // loading indicator
  if (!order || ledgerEntry === undefined) {
    return (
      <View style={{ ...screens.centered, backgroundColor: colors.grey50 }}>
        <ActivityIndicator size="small" color={colors.green500} />
      </View>
    );
  }
  // helpers
  const time = getOrderTime(order);
  const delivery =
    (order.fare?.courier?.value ?? 0) - (order.fare?.courier?.processing?.value ?? 0);
  const tip = (order.tip?.value ?? 0) - (order.tip?.processing?.value ?? 0);
  const revenue = delivery + tip + (ledgerEntry?.value ?? 0);
  const title = formatCurrency(revenue);
  const subtitle = `Pedido ${order.code}\n${separateWithDot(formatDate(time), formatTime(time))}`;
  // UI
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          borderBottomColor: colors.grey500,
          borderStyle: 'solid',
          borderBottomWidth: 1,
          paddingLeft: padding,
          paddingTop: padding,
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: padding,
              paddingLeft: halfPadding,
              paddingRight: padding,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ ...texts.sm }}>{title}</Text>
              <Text
                style={{
                  ...texts.sm,
                  color: colors.grey700,
                  flexWrap: 'wrap',
                }}
              >
                {subtitle}
              </Text>
            </View>
            <View style={{ marginLeft: padding }}>
              <ArrowBox />
            </View>
          </View>
          {order ? (
            <View
              style={{ paddingRight: padding, paddingBottom: padding, paddingLeft: halfPadding }}
            >
              <StatusBadge order={order} />
              {order.status === 'delivered' && order.type === 'food' ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FoodOrderNavigator', {
                      screen: 'RestaurantNavigator',
                      params: {
                        restaurantId: order.business!.id,
                        screen: 'RestaurantDetail',
                      },
                    });
                  }}
                >
                  <RoundedText>Ver restaurante</RoundedText>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
