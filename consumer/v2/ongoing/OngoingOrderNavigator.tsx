import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../common/screens/options';
import { t } from '../../../strings';
import { ReportIssue } from '../common/ReportIssue';
import OngoingOrder from './OngoingOrder';
import { OngoingOrderCanceled } from './OngoingOrderCanceled';
import { OngoingOrderConfirmCancel } from './OngoingOrderConfirmCancel';
import { OngoingOrderCourierDetail } from './OngoingOrderCourierDetail';
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
        name="OngoingOrderConfirmCancel"
        component={OngoingOrderConfirmCancel}
        options={{ title: t('Cancelar pedido') }}
      />
      <Stack.Screen
        name="OngoingOrderCanceled"
        component={OngoingOrderCanceled}
        options={{ title: t('Sua opinião') }}
      />
      <Stack.Screen
        name="OngoingOrderCourierDetail"
        component={OngoingOrderCourierDetail}
        options={{ title: t('Mais informações') }}
      />
      <Stack.Screen
        name="OngoingOrderReportIssue"
        component={ReportIssue}
        options={{ title: t('Relatar um problema') }}
      />
      {/* <Stack.Screen
        name="DeliveredOrderFeedback"
        component={DeliveredOrderFeedback}
        options={{ title: 'Detalhe do pedido' }}
      /> */}
      {/*
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Chat') }} />
      <Stack.Screen
        name="OrderDeliveredFeedback"
        component={OrderDeliveredFeedback}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};
