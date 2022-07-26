import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from '../../../../common/screens/Chat';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import DeliveryHistoryByMonth from './DeliveryHistoryByMonth';
import DeliverySummary from './DeliverySummary';
import { DeliveriesNavigatorParamList } from './types';
import { AdvanceReceivables } from './withdraw/AdvanceReceivables';
import { Receivables } from './withdraw/Receivables';
import { WithdrawFeedback } from './withdraw/WithdrawFeedback';
import { Withdraws } from './withdraw/Withdraws';

const Stack = createStackNavigator<DeliveriesNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DeliveryHistoryByMonth"
        component={DeliveryHistoryByMonth}
        options={{ title: t('Histórico') }}
      />
      <Stack.Screen
        name="DeliverySummary"
        component={DeliverySummary}
        options={{ title: t('Corrida finalizada') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Conversa') }} />
      <Stack.Screen
        name="Receivables"
        component={Receivables}
        options={{ title: t('Antecipação de valores') }}
      />
      <Stack.Screen
        name="AdvanceReceivables"
        component={AdvanceReceivables}
        options={{ title: t('Confirmar antecipação') }}
      />
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
      <Stack.Screen
        name="AdvanceReceivablesFeedback"
        component={WithdrawFeedback}
        options={{ title: t('Antecipação confirmada') }}
      />
    </Stack.Navigator>
  );
}
