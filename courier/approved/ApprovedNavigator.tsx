import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../common/screens/options';
import { PermissionDenied } from '../../common/screens/PermissionDenied';
import { t } from '../../strings';
import DeliveriesNavigator from './main/history/DeliveriesNavigator';
import MainNavigator from './main/MainNavigator';
import PaymentNavigator from './main/payment/PaymentNavigator';
import ProfileNavigator from './main/profile/ProfileNavigator';
import MatchingNavigator from './matching/MatchingNavigator';
import { DeliveryProblemNavigator } from './ongoing/delivery-problem/DeliveryProblemNavigator';
import OngoingDeliveryNavigator from './ongoing/OngoingDeliveryNavigator';
import { ApprovedParamList } from './types';

const Stack = createStackNavigator<ApprovedParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchingNavigator"
        component={MatchingNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingDeliveryNavigator"
        component={OngoingDeliveryNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveriesNavigator"
        component={DeliveriesNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryProblemNavigator"
        component={DeliveryProblemNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentNavigator"
        component={PaymentNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PermissionDenied"
        component={PermissionDenied}
        options={{ title: t('Compartilhar sua localização') }}
      />
    </Stack.Navigator>
  );
}
