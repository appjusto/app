import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from '../../../common/screens/Chat';
import { defaultScreenOptions } from '../../../common/screens/options';
import { ReportIssue } from '../../../common/screens/ReportIssue';
import { t } from '../../../strings';
import CancelOngoingDelivery from './CancelOngoingDelivery';
import DeliveryCompleted from './DeliveryCompleted';
import { NoCodeDelivery } from './NoCodeDelivery';
import OngoingDelivery from './OngoingDelivery';
import OrderCanceled from './OrderCanceled';
import { OngoingDeliveryNavigatorParamList } from './types';

const Stack = createStackNavigator<OngoingDeliveryNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="OngoingDelivery"
        component={OngoingDelivery}
        options={{ title: t('Corrida em andamento') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Conversa') }} />
      <Stack.Screen
        name="CancelOngoingDelivery"
        component={CancelOngoingDelivery}
        options={{ title: t('Cancelar corrida') }}
      />
      <Stack.Screen
        name="OrderCanceled"
        component={OrderCanceled}
        options={{ title: t('Corrida cancelada') }}
      />
      <Stack.Screen
        name="DeliveryCompleted"
        component={DeliveryCompleted}
        options={{ title: t('Avalie a corrida') }}
      />
      <Stack.Screen
        name="NoCodeDelivery"
        component={NoCodeDelivery}
        options={{ title: t('Confirmar entrega sem código') }}
      />
      <Stack.Screen
        name="ReportIssue"
        component={ReportIssue}
        options={{ title: t('Tive um problema') }}
      />
    </Stack.Navigator>
  );
}
