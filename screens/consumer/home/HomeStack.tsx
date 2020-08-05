import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AddressComplete from '../../common/AddressComplete';
import CreateOrderP2P from '../orders/p2p-order/CreateOrderP2P';
import ConsumerHome from './ConsumerHome';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ConsumerHome" component={ConsumerHome} />
      <Stack.Screen name="CreateOrderP2P" component={CreateOrderP2P} />
      <Stack.Screen name="AddressComplete" component={AddressComplete} />
    </Stack.Navigator>
  );
}
