import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import AddressComplete from '../../../home/orders/AddressComplete';
import AboutRestaurant from '../../../home/restaurants/restaurant/AboutRestaurant';
import RestaurantDetail from '../../../home/restaurants/restaurant/detail/RestaurantDetail';
import ItemDetail from '../../../home/restaurants/restaurant/item/ItemDetail';
import { OrderCheckout } from '../../../home/restaurants/restaurant/OrderCheckout';
import { RestaurantNavigatorParamList } from '../../../home/restaurants/restaurant/types';

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
        name="OrderCheckout"
        component={OrderCheckout}
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
