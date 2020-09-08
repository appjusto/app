import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../../common/components/buttons/BackButton';
import Chat from '../../../common/screens/Chat';
import { t } from '../../../strings';
import DeliveryHistory from './DeliveryHistory';
import DeliveryHistoryByMonth from './DeliveryHistoryByMonth';
import OngoingOrder from './OngoingOrder';
import { HistoryNavigatorParamList } from './types';

const Stack = createStackNavigator<HistoryNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeliveryHistory"
        component={DeliveryHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DeliveryHistoryByMonth"
        component={DeliveryHistoryByMonth}
        options={({ navigation }) => ({
          title: t('Corrida em '),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
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
    </Stack.Navigator>
  );
}
