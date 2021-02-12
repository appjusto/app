import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../../../common/components/views/ArrowBox';
import PermissionDeniedFeedback from '../../../../common/screens/PermissionDeniedFeedback';
import { t } from '../../../../strings';
import FleetNavigator from '../profile/fleet/FleetNavigator';
import Home from './Home';
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
