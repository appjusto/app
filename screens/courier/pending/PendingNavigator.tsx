import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ProfileEdit from '../../profile/ProfileEdit';
import { OnboardingParamList } from './types';

const Stack = createStackNavigator<OnboardingParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
    </Stack.Navigator>
  );
}
