import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../common/components/views/ArrowBox';
import { t } from '../../strings';
import OrderConfirmedFeedback from '../home/orders/OrderConfirmedFeedback';
import OrderHistory from './OrderHistory';
import OrderSummary from './OrderSummary';
import { HistoryParamList } from './types';

const Stack = createStackNavigator<HistoryParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: false }} />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{ title: t('Corrida finalizada') }}
      />
      <Stack.Screen
        name="OrderConfirmedFeedback"
        component={OrderConfirmedFeedback}
        options={{ title: t('Pedido em andamento') }}
      />
    </Stack.Navigator>
  );
}
