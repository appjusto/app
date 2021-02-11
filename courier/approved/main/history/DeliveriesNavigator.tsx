import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../../../common/components/views/ArrowBox';
import { getMonthName } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import DeliveryHistory from './DeliveryHistory';
import DeliveryHistoryByMonth from './DeliveryHistoryByMonth';
import DeliverySummary from './DeliverySummary';
import { DeliveriesNavigatorParamList } from './types';

const Stack = createStackNavigator<DeliveriesNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen
        name="DeliveryHistory"
        component={DeliveryHistory}
        options={{ title: t('Suas corridas') }}
      />
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
    </Stack.Navigator>
  );
}
