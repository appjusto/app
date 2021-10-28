import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../common/screens/options';
import { t } from '../../../strings';
import Matching from './Matching';
import MatchingError from './MatchingError';
import OrderRequests from './OrderRequests';
import { RejectedMatching } from './RejectedMatching';
import { MatchingParamList } from './types';

const Stack = createStackNavigator<MatchingParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="OrderRequests"
        component={OrderRequests}
        options={{ title: t('Pedidos disponíveis') }}
      />
      <Stack.Screen name="Matching" component={Matching} options={{ headerShown: false }} />
      <Stack.Screen
        name="MatchingError"
        component={MatchingError}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RejectedMatching"
        component={RejectedMatching}
        options={{ title: t('Recusou o pedido') }}
      />
    </Stack.Navigator>
  );
}
