import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from '../../../common/screens/Chat';
import { defaultScreenOptions } from '../../../common/screens/options';
import { ReportIssue } from '../../../common/screens/ReportIssue';
import { t } from '../../../strings';
import { OrderProblemFeedback } from '../ongoing/OrderProblemFeedback';
import { DeliveredOrderDetail } from './DeliveredOrderDetail';
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
        name="ReportIssue"
        component={ReportIssue}
        options={{ title: t('Relatar problema') }}
      />
      <Stack.Screen
        name="OrderProblemFeedback"
        component={OrderProblemFeedback}
        options={{ title: t('Tive um problema') }}
      />
      <Stack.Screen name="DeliveredOrderChat" component={Chat} options={{ title: t('Chat') }} />
    </Stack.Navigator>
  );
};
