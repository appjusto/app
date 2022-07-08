import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from '../../../common/screens/Chat';
import { defaultScreenOptions } from '../../../common/screens/options';
import OrderCanceled from '../../../common/screens/orders/OrderCanceled';
import { ReportIssue } from '../../../common/screens/ReportIssue';
import { t } from '../../../strings';
import { OngoingOrderDeclined } from '../common/OngoingOrderDeclined';
import ProfileAddCard from '../main/profile/ProfileAddCard';
import ProfilePaymentMethods from '../main/profile/ProfilePaymentMethods';
import { OrderConfirming } from './confirming/OrderConfirming';
import { ScheduledOrderConfirmation } from './confirming/scheduled/ScheduledOrderConfirmation';
import { OngoingOrderCourierDetail } from './courier-detail/OngoingOrderCourierDetail';
import OngoingOrder from './OngoingOrder';
import { OngoingOrderCancelOrder } from './OngoingOrderCancelOrder';
import { OngoingOrderConfirmCancel } from './OngoingOrderConfirmCancel';
import OngoingOrderFeedback from './OngoingOrderFeedback';
import { OngoingOrderProblem } from './OngoingOrderProblem';
import { OrderNoMatch } from './OrderNoMatch';
import { OrderProblemFeedback } from './OrderProblemFeedback';
import { OngoingOrderNavigatorParamList } from './types';

const Stack = createStackNavigator<OngoingOrderNavigatorParamList>();

export const OngoingOrderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="OngoingOrderConfirming"
        component={OrderConfirming}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScheduledOrderConfirmation"
        component={ScheduledOrderConfirmation}
        options={{ title: t('Pedido agendado') }}
      />
      <Stack.Screen
        name="OngoingOrderDeclined"
        component={OngoingOrderDeclined}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingOrderNoMatch"
        component={OrderNoMatch}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={{ title: t('Pedido em andamento') }}
      />
      <Stack.Screen
        name="OrderCanceled"
        component={OrderCanceled}
        options={{ title: t('Pedido cancelado') }}
      />
      <Stack.Screen
        name="OngoingOrderConfirmCancel"
        component={OngoingOrderConfirmCancel}
        options={{ title: t('Cancelar pedido') }}
      />
      <Stack.Screen
        name="OngoingOrderCancelOrder"
        component={OngoingOrderCancelOrder}
        options={{ title: t('Cancelar pedido') }}
      />
      <Stack.Screen
        name="OngoingOrderProblem"
        component={OngoingOrderProblem}
        options={{ title: t('Tive um problema') }}
      />
      {/* <Stack.Screen
        name="ChangeRoute"
        component={ChangeRoute}
        options={{ title: t('Alterar endereço') }}
      /> */}
      <Stack.Screen
        name="OrderProblemFeedback"
        component={OrderProblemFeedback}
        options={{ title: t('Tive um problema') }}
      />
      <Stack.Screen
        name="OngoingOrderCourierDetail"
        component={OngoingOrderCourierDetail}
        options={{ title: t('Mais informações') }}
      />
      <Stack.Screen
        name="ReportIssue"
        component={ReportIssue}
        options={{ title: t('Relatar problema') }}
      />
      <Stack.Screen
        name="OngoingOrderFeedback"
        component={OngoingOrderFeedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
      />
      <Stack.Screen name="OngoingOrderChat" component={Chat} options={{ title: t('Chat') }} />
    </Stack.Navigator>
  );
};
