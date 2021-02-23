import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../common/components/views/ArrowBox';
import { ReportIssue } from '../../common/screens/ReportIssue';
import { t } from '../../strings';
import OrderConfirming from '../home/orders/OrderConfirming';
import ReviewCourier from '../home/orders/ReviewCourier';
import OrderDetail from './OrderDetail';
import OrderHistory from './OrderHistory';
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
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{ title: t('Seus pedidos') }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: t('Corrida finalizada') }}
      />
      <Stack.Screen
        name="OrderConfirming"
        component={OrderConfirming}
        options={{ title: t('Aguardando confirmação') }}
      />
      <Stack.Screen
        name="ReviewCourier"
        component={ReviewCourier}
        options={{ title: t('Avaliar entregador') }}
      />
      <Stack.Screen
        name="ReportIssueViaHistory"
        component={ReportIssue}
        options={{ title: t('Relatar um problema') }}
      />
    </Stack.Navigator>
  );
}
