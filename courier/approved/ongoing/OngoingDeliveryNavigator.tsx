import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from '../../../common/screens/Chat';
import { defaultScreenOptions } from '../../../common/screens/options';
import OrderCanceled from '../../../common/screens/orders/OrderCanceled';
import { ReportIssue } from '../../../common/screens/ReportIssue';
import { t } from '../../../strings';
import { CallCourier } from './CallCourier';
import CancelOngoingDelivery from './CancelOngoingDelivery';
import { CourierDropsOrder } from './CourierDropsOrder';
import DeliveryCompleted from './DeliveryCompleted';
import { DeliveryProblem } from './DeliveryProblem';
import { DeliveryProblemFeedback } from './DeliveryProblemFeedback';
import { NoCodeDelivery } from './NoCodeDelivery';
import OngoingDelivery from './OngoingDelivery';
import { OrderNull } from './OrderNull';
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
        name="OrderNull"
        component={OrderNull}
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
      <Stack.Screen
        name="DeliveryProblem"
        component={DeliveryProblem}
        options={{ title: t('Tive um problema') }}
      />
      <Stack.Screen
        name="DeliveryProblemFeedback"
        component={DeliveryProblemFeedback}
        options={{ title: t('Tive um problema') }}
      />
      <Stack.Screen
        name="CourierDropsOrder"
        component={CourierDropsOrder}
        options={{ title: t('Tive um problema') }}
      />
      <Stack.Screen
        name="CallCourier"
        component={CallCourier}
        options={{ title: t('Tive um problema') }}
      />
    </Stack.Navigator>
  );
}
