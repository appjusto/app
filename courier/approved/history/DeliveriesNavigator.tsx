import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../../common/components/buttons/BackButton';
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
    <Stack.Navigator>
      <Stack.Screen
        name="DeliveryHistory"
        component={DeliveryHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryHistoryByMonth"
        component={DeliveryHistoryByMonth}
        options={({ navigation, route }) => ({
          title: `${t('Corridas em')} ${getMonthName(route.params.month)}`,
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="OngoingDelivery"
        component={OngoingDelivery}
        options={({ navigation }) => ({
          title: t('Corrida em andamento'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ navigation }) => ({
          title: t('Conversa'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="DeliverySummary"
        component={DeliverySummary}
        options={({ navigation }) => ({
          title: t('Corrida finalizada'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
