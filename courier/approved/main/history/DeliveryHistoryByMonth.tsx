import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order, WithId } from 'appjusto-types';
import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import ConfigItem from '../../../../common/components/views/ConfigItem';
import { getOrders, getOrdersWithFilter } from '../../../../common/store/order/selectors';
import { screens } from '../../../../common/styles';
import { formatTime, formatCurrency } from '../../../../common/utils/formatters';
import { DeliveriesNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<
  DeliveriesNavigatorParamList,
  'DeliveryHistoryByMonth'
>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'DeliveryHistoryByMonth'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const { year, month } = route.params;

  // app state
  const orders = useSelector(getOrders);
  const filteredOrders = getOrdersWithFilter(orders, year, month);

  // handlers
  const orderPressHandler = useCallback((order: WithId<Order>) => {
    if (order.status === 'dispatching') {
      navigation.navigate('OngoingDelivery', { orderId: order.id! });
    } else {
      navigation.navigate('DeliverySummary', { orderId: order.id! });
    }
  }, []);

  // UI
  return (
    <View style={{ ...screens.configScreen }}>
      <FlatList
        style={{ flex: 1 }}
        data={filteredOrders}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => {
          const title = formatCurrency(item.fare!.courierFee);
          const subtitle =
            item.origin.address?.description +
            '\n' +
            formatTime((item.createdOn as firebase.firestore.Timestamp).toDate());
          return (
            <ConfigItem title={title} subtitle={subtitle} onPress={() => orderPressHandler(item)} />
          );
        }}
      />
    </View>
  );
}
