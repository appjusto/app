import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../common/components/buttons/BackButton';
import Chat from '../../common/screens/Chat';
import { t } from '../../strings';
import OngoingOrder from './OngoingOrder';
import OrderHistory from './OrderHistory';
import OrderSummary from './OrderSummary';
import { HistoryParamList } from './types';

const Stack = createStackNavigator<HistoryParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: false }} />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={({ navigation }) => ({
          title: t('Pedido em andamento'),
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
        name="OrderSummary"
        component={OrderSummary}
        options={({ navigation }) => ({
          title: t('Corrida finalizada'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
