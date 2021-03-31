import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import ProfileBank from '../profile/bank/ProfileBank';
import { Payment } from './Payment';
import { PaymentRequestedFeedback } from './PaymentRequestedFeedback';
import { PaymentNavigatorParamList } from './types';

const Stack = createStackNavigator<PaymentNavigatorParamList>();

export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {/* change to dynamic name */}
      <Stack.Screen name="Payment" component={Payment} options={{ title: t('Adiantar valores') }} />
      <Stack.Screen
        name="ProfileBank"
        component={ProfileBank}
        options={{ title: t('Dados bancários') }}
      />
      <Stack.Screen
        name="PaymentRequestedFeedback"
        component={PaymentRequestedFeedback}
        options={{ title: t('Confirmação da transferência'), headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
}
