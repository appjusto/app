import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../../common/components/buttons/BackButton';
import ArrowBox from '../../../common/components/views/ArrowBox';
import Chat from '../../../common/screens/Chat';
import { getMonthName } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import DeliveryHistory from './DeliveryHistory';
import DeliveryHistoryByMonth from './DeliveryHistoryByMonth';
import DeliverySummary from './DeliverySummary';
import OngoingDelivery from './OngoingDelivery';
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryHistoryByMonth"
        component={DeliveryHistoryByMonth}
        options={({ route }) => ({
          title: `${t('Corridas em')} ${getMonthName(route.params.month)}`,
        })}
      />
      <Stack.Screen
        name="OngoingDelivery"
        component={OngoingDelivery}
        options={{ title: t('Corrida em andamento') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Conversa') }} />
      <Stack.Screen
        name="DeliverySummary"
        component={DeliverySummary}
        options={{ title: t('Corrida finalizada') }}
      />
    </Stack.Navigator>
  );
}
