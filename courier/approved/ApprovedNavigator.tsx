import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../common/screens/options';
import MainNavigator from './main/MainNavigator';
import MatchingNavigator from './matching/MatchingNavigator';
import OngoingDeliveryNavigator from './ongoing/OngoingDeliveryNavigator';
import { ApprovedParamList } from './types';

const Stack = createStackNavigator<ApprovedParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchingNavigator"
        component={MatchingNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingDeliveryNavigator"
        component={OngoingDeliveryNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
