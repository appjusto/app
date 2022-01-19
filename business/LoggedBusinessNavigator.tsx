import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../common/screens/options';
import { t } from '../strings';
import { BusinessOrders } from './orders/BusinessOrders';

//TODO: create and add params list
const Stack = createStackNavigator();

export const LoggedBusinessNavigator = () => {
  //TODO: wrap this stack with the right context
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name="BusinessOrders"
      component={BusinessOrders}
      options={{ title: t('Pedidos'), headerLeft: () => null }}
    />
  </Stack.Navigator>;
};
