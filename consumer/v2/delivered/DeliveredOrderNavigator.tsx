import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../common/screens/options';
import { t } from '../../../strings';
import { ReportIssue } from '../common/ReportIssue';
import { DeliveredOrderDetail } from './DeliveredOrderDetail';
import DeliveredOrderFeedback from './DeliveredOrderFeedback';
import { DeliveredOrderNavigatorParamList } from './types';

const Stack = createStackNavigator<DeliveredOrderNavigatorParamList>();

export const DeliveredOrderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DeliveredOrderDetail"
        component={DeliveredOrderDetail}
        options={{ title: 'Detalhe do pedido' }}
      />
      <Stack.Screen
        name="DeliveredOrderFeedback"
        component={DeliveredOrderFeedback}
        options={{ title: 'Detalhe do pedido' }}
      />
      <Stack.Screen
        name="DeliveredOrderReportIssue"
        component={ReportIssue}
        options={{ title: t('Relatar um problema') }}
      />
    </Stack.Navigator>
  );
};
