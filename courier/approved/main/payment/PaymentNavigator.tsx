import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import { AntecipatePayment } from './AntecipatePayment';
import { PaymentNavigatorParamList } from './types';
import { WithDrawPayment } from './WithdrawPayment';

const Stack = createStackNavigator<PaymentNavigatorParamList>();

export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="AntecipatePayment"
        component={AntecipatePayment}
        options={{ title: t('Adiantar valores') }}
      />
      <Stack.Screen
        name="WithDrawPayment"
        component={WithDrawPayment}
        options={{ title: t('Transferir valores') }}
      />
    </Stack.Navigator>
  );
}
