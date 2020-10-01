import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../../common/components/views/ArrowBox';
import Chat from '../../../common/screens/Chat';
import { t } from '../../../strings';
import DeliveryCompleted from './DeliveryCompleted';
import OngoingDelivery from './OngoingDelivery';
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
        name="DeliveryCompleted"
        component={DeliveryCompleted}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
