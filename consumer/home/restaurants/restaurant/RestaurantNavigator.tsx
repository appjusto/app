import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../../../common/components/views/ArrowBox';
import { t } from '../../../../strings';
import AddressComplete from '../../orders/AddressComplete';
import AboutRestaurant from './AboutRestaurant';
import RestaurantDetail from './detail/RestaurantDetail';
import ItemDetail from './item/ItemDetail';
import { OrderCheckout } from './OrderCheckout';
import { RestaurantNavigatorParamList } from './types';

const Stack = createStackNavigator<RestaurantNavigatorParamList>();

export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
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
