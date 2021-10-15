import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FleetDetail from '../../../../common/screens/fleet/FleetDetail';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import { AddressComplete } from '../../common/AddressComplete';
import { PayWithPix } from '../../common/PayWithPix';
import ProfileAddCard from '../../main/profile/ProfileAddCard';
import ProfileEdit from '../../main/profile/ProfileEdit';
import ProfilePaymentMethods from '../../main/profile/ProfilePaymentMethods';
import { AboutCharges } from '../../p2p/AboutCharges';
import { AboutRestaurant } from './about/AboutRestaurant';
import { FoodOrderCheckout } from './checkout/FoodOrderCheckout';
import { RestaurantDetail } from './detail/RestaurantDetail';
import { ItemDetail } from './product/ItemDetail';
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
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Dados pessoais') }}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
      />
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="AboutCharges"
        component={AboutCharges}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="PayWithPix"
        component={PayWithPix}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="OrderDestination"
        component={AddressComplete}
        options={{ title: t('Endereço de entrega') }}
      />
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Endereço de entrega') }}
      />
    </Stack.Navigator>
  );
}
