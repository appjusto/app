import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import { Payment } from './Payment';
import { PaymentNavigatorParamList } from './types';

const Stack = createStackNavigator<PaymentNavigatorParamList>();

export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {/* change to dynamic name */}
      <Stack.Screen name="Payment" component={Payment} options={{ title: t('Adiantar valores') }} />
    </Stack.Navigator>
  );
}
