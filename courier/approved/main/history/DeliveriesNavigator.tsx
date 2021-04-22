import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { getMonthName } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import ProfileSubmitted from '../../../unapproved/ProfileSubmitted';
import DeliveryHistoryByMonth from './DeliveryHistoryByMonth';
import DeliverySummary from './DeliverySummary';
import { DeliveriesNavigatorParamList } from './types';

const Stack = createStackNavigator<DeliveriesNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DeliveryHistoryByMonth"
        component={DeliveryHistoryByMonth}
        options={({ route }) => ({
          title: `${t('Corridas em')} ${getMonthName(route.params.month)}`,
        })}
      />
      <Stack.Screen
        name="DeliverySummary"
        component={DeliverySummary}
        options={{ title: t('Corrida finalizada') }}
      />
      <Stack.Screen
        name="ProfileSubmitted"
        component={ProfileSubmitted}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
