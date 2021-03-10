import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import { AddressComplete } from '../../common/AddressComplete';
import { AboutRestaurant } from './AboutRestaurant';
import { FoodOrderCheckout } from './checkout/FoodOrderCheckout';
import { ItemDetail } from './product/ItemDetail';
import { RestaurantDetail } from './RestaurantDetail';
import { RestaurantNavigatorParamList } from './types';

const Stack = createStackNavigator<RestaurantNavigatorParamList>();

export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName="RestaurantDetail">
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetail}
        options={{ title: t('Saber mais') }}
      />
      <Stack.Screen
        name="AboutRestaurant"
        component={AboutRestaurant}
        options={{ title: t('Saber mais') }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{ title: t('Detalhes do item') }}
      />
      <Stack.Screen
        name="FoodOrderCheckout"
        component={FoodOrderCheckout}
        options={{ title: t('Sua sacola') }}
      />
      <Stack.Screen
        name="OrderDestination"
        component={AddressComplete}
        options={{ title: t('Endereço de entrega') }}
      />
    </Stack.Navigator>
  );
}
