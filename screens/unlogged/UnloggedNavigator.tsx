import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../strings';
import SignInFeedback from './SignInFeedback';
import Terms from './Terms';
import WelcomeScreen from './WelcomeScreen';
import { UnloggedParamList } from './types';

const StackNavigator = createStackNavigator<UnloggedParamList>();
export default function () {
  return (
    <StackNavigator.Navigator>
      <StackNavigator.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false, title: '' }}
      />
      <StackNavigator.Screen
        name="SignInFeedback"
        component={SignInFeedback}
        options={{ title: t('Verifique seu e-mail') }}
      />
      <StackNavigator.Screen name="Terms" component={Terms} options={{ title: '' }} />
    </StackNavigator.Navigator>
  );
}
