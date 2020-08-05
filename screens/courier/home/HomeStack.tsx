import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import CourierHome from './CourierHome';
import PermissionDeniedFeedback from './PermissionDeniedFeedback';
import Matching from './matching/Matching';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CourierHome" component={CourierHome} />
      <Stack.Screen name="Matching" component={Matching} />
      <Stack.Screen name="PermissionDeniedFeedback" component={PermissionDeniedFeedback} />
    </Stack.Navigator>
  );
}
