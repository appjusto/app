import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FleetDetail from '../../../../common/screens/fleet/FleetDetail';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { CommonProfileEdit } from '../../../../common/screens/profile/CommonProfileEdit';
import { PhoneVerificationScreen } from '../../../../common/screens/profile/PhoneVerificationScreen';
import { t } from '../../../../strings';
import { AddressComplete } from '../../common/AddressComplete';
import { AvailableFleets } from '../../common/AvailableFleets';
import { PayWithPix } from '../../common/PayWithPix';
import ProfileAddCard from '../../main/profile/ProfileAddCard';
import ProfilePaymentMethods from '../../main/profile/ProfilePaymentMethods';
import { SelectPaymentMethod } from '../../main/profile/SelectPaymentMethod';
import { AboutRestaurant } from './about/AboutRestaurant';
import { RestaurantHeaderMessage } from './about/RestaurantHeaderMessage';
import { FoodOrderCheckout } from './checkout/FoodOrderCheckout';
import { ScheduleOrder } from './checkout/ScheduleOrder';
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
      <Stack.Screen name="RestaurantHeaderMessage" component={RestaurantHeaderMessage} />
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
        name="ScheduleOrder"
        component={ScheduleOrder}
        options={{ title: t('Agendamento') }}
      />
      <Stack.Screen
        name="CommonProfileEdit"
        component={CommonProfileEdit}
        options={{ title: t('Seus dados') }}
      />
      <Stack.Screen
        name="PhoneVerificationScreen"
        component={PhoneVerificationScreen}
        options={{ title: t('Verificação de telefone') }}
      />
      <Stack.Screen
        name="AvailableFleets"
        component={AvailableFleets}
        options={{ title: t('Frotas disponíveis') }}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
      />
      <Stack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
        options={{ title: t('Selecionar pagamento') }}
      />
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
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
