import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import { getOrders } from '../../../store/order/selectors';
import { screens, padding } from '../../common/styles';
import OrderItem from './OrderItem';
import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryNavigatorParamList, 'OrderHistory'>;
type ScreenRouteProp = RouteProp<HistoryNavigatorParamList, 'OrderHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // app state
  const orders = useSelector(getOrders);

  return (
    <View style={{ ...screens.configScreen, marginTop: padding }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderItem
            order={item}
            onPress={() =>
              navigation.navigate('OrderDetail', {
                orderId: item.id,
              })
            }
          />
        )}
      />
    </View>
  );
}
