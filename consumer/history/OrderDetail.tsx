import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { getOrderById } from '../../common/store/order/selectors';
import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryNavigatorParamList, 'OrderDetail'>;
type ScreenRouteProp = RouteProp<HistoryNavigatorParamList, 'OrderDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  const { orderId } = route.params;
  const order = useSelector(getOrderById)(orderId);

  return (
    <View>
      <Text>{order.origin.address}</Text>
    </View>
  );
}
