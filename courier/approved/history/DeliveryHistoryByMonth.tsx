import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order } from 'appjusto-types';
import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import PaddedView from '../../../common/components/views/PaddedView';
import { getOrdersWithFilter } from '../../../common/store/order/selectors';
import { screens, texts, padding, colors } from '../../../common/styles';
import { hhMMFromDate, formatCurrency } from '../../../common/utils/formatters';
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
  const orders = useSelector(getOrdersWithFilter)(year, month);

  // handlers
  const orderPressHandler = (order: Order) => {
    if (order.status === 'dispatching') {
      navigation.navigate('OngoingDelivery', { orderId: order.id });
    } else {
      navigation.navigate('DeliverySummary', { orderId: order.id });
    }
  };
  // UI
  return (
    <View style={{ ...screens.configScreen }}>
      <FlatList
        style={{ flex: 1 }}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => orderPressHandler(item)}>
              <PaddedView>
                <Text style={{ ...texts.medium, marginBottom: padding }}>
                  {formatCurrency(item.fare.courierFee)}
                </Text>
                <Text style={[texts.medium, { color: colors.darkGrey }]}>
                  {item.origin.address}
                </Text>
                <Text style={[texts.medium, { color: colors.darkGrey }]}>
                  {hhMMFromDate(item.createdOn.toDate())}
                </Text>
              </PaddedView>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
