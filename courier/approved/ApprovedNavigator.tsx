import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../common/components/views/ArrowBox';
import MainNavigator from './main/MainNavigator';
import MatchingNavigator from './matching/MatchingNavigator';
import OngoingNavigator from './ongoing/OngoingNavigator';
import { ApprovedParamList } from './types';

const Stack = createStackNavigator<ApprovedParamList>();
export default function () {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
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
        name="OngoingNavigator"
        component={OngoingNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
