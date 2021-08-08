import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { getMonthName } from '../../../../common/utils/formatters/datetime';
import { t } from '../../../../strings';
import DeliveryHistoryByMonth from './DeliveryHistoryByMonth';
import DeliverySummary from './DeliverySummary';
import { DeliveriesNavigatorParamList } from './types';
import { AdvanceReceivables } from './withdraw/AdvanceReceivables';
import { Receivables } from './withdraw/Receivables';

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
        name="Receivables"
        component={Receivables}
        options={{ title: t('Antecipação de valores') }}
      />
      <Stack.Screen
        name="AdvanceReceivables"
        component={AdvanceReceivables}
        options={{ title: t('Confirmar antecipação') }}
      />
    </Stack.Navigator>
  );
}
