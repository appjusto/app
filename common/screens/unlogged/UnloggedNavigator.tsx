import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import ArrowBox from '../../components/views/ArrowBox';
import SignInFeedback from './SignInFeedback';
import Terms from './Terms';
import WelcomeScreen from './WelcomeScreen';
import { UnloggedParamList } from './types';

const StackNavigator = createStackNavigator<UnloggedParamList>();
export default function () {
  return (
    <StackNavigator.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
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
