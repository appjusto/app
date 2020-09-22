import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../../common/components/views/ArrowBox';
import { t } from '../../../strings';
import OrderCompleted from '../matching/OrderCompleted';
import OrderRefused from '../matching/OrderRefused';
import Home from './Home';
import PermissionDeniedFeedback from './PermissionDeniedFeedback';
import { HomeParamList } from './types';

const Stack = createStackNavigator<HomeParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="OrderRefused"
        component={OrderRefused}
        options={{ title: t('Recusou o pedido') }}
      />
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ title: t('Compartilhar localização') }}
      />
      <Stack.Screen
        name="OrderCompleted"
        component={OrderCompleted}
        options={{ title: t('Avalie a corrida') }}
      />
    </Stack.Navigator>
  );
}
