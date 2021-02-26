import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { t } from '../../../strings';
import { defaultScreenOptions } from '../options';
import SignInFeedback from './SignInFeedback';
import Terms from './Terms';
import { UnloggedParamList } from './types';
import WelcomeScreen from './WelcomeScreen';

const StackNavigator = createStackNavigator<UnloggedParamList>();
export default function () {
  return (
    <StackNavigator.Navigator screenOptions={defaultScreenOptions}>
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
      <StackNavigator.Screen
        name="Terms"
        component={Terms}
        options={{ title: t('Fique por dentro') }}
      />
    </StackNavigator.Navigator>
  );
}
