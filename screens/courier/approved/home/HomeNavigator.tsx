import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Home from './Home';
import PermissionDeniedFeedback from './PermissionDeniedFeedback';
import Matching from './matching/Matching';
import { HomeParamList } from './types';

const Stack = createStackNavigator<HomeParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Matching" component={Matching} />
      <Stack.Screen name="PermissionDeniedFeedback" component={PermissionDeniedFeedback} />
    </Stack.Navigator>
  );
}
