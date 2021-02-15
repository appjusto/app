import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../../common/components/views/ArrowBox';
import Chat from '../../../common/screens/Chat';
import { t } from '../../../strings';
import CancelOngoingDelivery from './CancelOngoingDelivery';
import CourierDeliveryProblem from './CourierDeliveryProblem';
import DeliveryCompleted from './DeliveryCompleted';
import { NoCodeDelivery } from './NoCodeDelivery';
import OngoingDelivery from './OngoingDelivery';
import OrderCanceled from './OrderCanceled';
import { OngoingParamList } from './types';

const Stack = createStackNavigator<OngoingParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
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
        name="CourierDeliveryProblem"
        component={CourierDeliveryProblem}
        options={{ title: t('Tive um problema') }}
      />
    </Stack.Navigator>
  );
}
