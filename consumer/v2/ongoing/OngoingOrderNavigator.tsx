import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from '../../../common/screens/Chat';
import { defaultScreenOptions } from '../../../common/screens/options';
import { ReportIssue } from '../../../common/screens/ReportIssue';
import { DeliveryProblemFeedback } from '../../../courier/approved/ongoing/DeliveryProblemFeedback';
import OrderCanceled from '../../../courier/approved/ongoing/OrderCanceled';
import { t } from '../../../strings';
import { OngoingOrderDeclined } from '../common/OngoingOrderDeclined';
import ProfilePaymentMethods from '../main/profile/ProfilePaymentMethods';
import { OngoingOrderCourierDetail } from './courier-detail/OngoingOrderCourierDetail';
import OngoingOrder from './OngoingOrder';
import { OngoingOrderCancelOrder } from './OngoingOrderCancelOrder';
import { OngoingOrderConfirmCancel } from './OngoingOrderConfirmCancel';
import OngoingOrderFeedback from './OngoingOrderFeedback';
import { OrderConfirming } from './OrderConfirming';
import { OrderNoMatch } from './OrderNoMatch';
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
        options={{ title: t('Pedido em andamento') }}
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
        name="DeliveryProblemFeedback"
        component={DeliveryProblemFeedback}
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
      <Stack.Screen name="OngoingOrderChat" component={Chat} options={{ title: t('Chat') }} />
    </Stack.Navigator>
  );
};
