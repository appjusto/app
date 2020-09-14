import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order } from 'appjusto-types';
import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import { getOrders } from '../../common/store/order/selectors';
import { screens, padding } from '../../common/styles';
import { HomeNavigatorParamList } from '../home/types';
import OrderItem from './OrderItem';
import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HistoryNavigatorParamList, 'OrderHistory'>,
  BottomTabNavigationProp<HomeNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<HistoryNavigatorParamList, 'OrderHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // app state
  const orders: Order[] = useSelector(getOrders);

  return (
    <View style={{ ...screens.configScreen, marginTop: padding }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderItem
            order={item}
            onPress={() => {
              if (item.status === 'quote') {
                navigation.navigate('CreateOrderP2P', { orderId: item.id });
              } else {
                navigation.navigate('OrderDetail', {
                  orderId: item.id,
                });
              }
            }}
          />
        )}
      />
    </View>
  );
}
