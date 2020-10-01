import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../../common/components/views/ArrowBox';
import Matching from './Matching';
import MatchingError from './MatchingError';
import MatchingRefused from './MatchingRefused';
import { MatchingParamList } from './types';

const Stack = createStackNavigator<MatchingParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Matching" component={Matching} options={{ headerShown: false }} />
      <Stack.Screen
        name="MatchingError"
        component={MatchingError}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchingRefused"
        component={MatchingRefused}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
