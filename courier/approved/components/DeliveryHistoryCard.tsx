import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import ArrowBox from '../../../common/components/views/ArrowBox';
import StatusBadge from '../../../common/components/views/StatusBadge';
import { getOrderRevenue } from '../../../common/store/api/order/courier/getOrderRevenue';
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
  // screen state
  const order = useObserveOrder(orderId);
  // loading indicator
  if (!order) {
    return (
      <View style={{ ...screens.centered, backgroundColor: colors.grey50 }}>
        <ActivityIndicator size="small" color={colors.green500} />
      </View>
    );
  }
  // helpers
  const time = getOrderTime(order);
  const revenue = getOrderRevenue(order);
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
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
