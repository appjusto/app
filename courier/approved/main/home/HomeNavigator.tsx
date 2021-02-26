import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import PermissionDeniedFeedback from '../../../../common/screens/PermissionDeniedFeedback';
import { t } from '../../../../strings';
import FleetNavigator from '../profile/fleet/FleetNavigator';
import Home from './Home';
import { HomeParamList } from './types';

const Stack = createStackNavigator<HomeParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ title: t('Compartilhar sua localização') }}
      />
      <Stack.Screen
        name="FleetNavigator"
        component={FleetNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
