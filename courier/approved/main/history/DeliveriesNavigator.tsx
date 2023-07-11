import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from '../../../../common/screens/Chat';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import { DeliveryHistoryByWeek } from './DeliveryHistoryByWeek';
import DeliverySummary from './DeliverySummary';
import { DeliveriesNavigatorParamList } from './types';
import { WithdrawFeedback } from './withdraw/WithdrawFeedback';
import { Withdraws } from './withdraw/Withdraws';

const Stack = createStackNavigator<DeliveriesNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DeliveryHistoryByWeek"
        component={DeliveryHistoryByWeek}
        options={{ title: t('Histórico') }}
      />
      <Stack.Screen
        name="DeliverySummary"
        component={DeliverySummary}
        options={{ title: t('Corrida finalizada') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Conversa') }} />
      <Stack.Screen
        name="Withdraws"
        component={Withdraws}
        options={{ title: t('Transferência') }}
      />
      <Stack.Screen
        name="RequestWithdrawFeedback"
        component={WithdrawFeedback}
        options={{ title: t('Requisição confirmada') }}
      />
    </Stack.Navigator>
  );
}
