import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../../../common/components/views/ArrowBox';
import PermissionDeniedFeedback from '../../../../common/screens/PermissionDeniedFeedback';
import FleetDetail from '../../../../common/screens/fleet/FleetDetail';
import { t } from '../../../../strings';
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Detalhes da frota') }}
      />
    </Stack.Navigator>
  );
}
