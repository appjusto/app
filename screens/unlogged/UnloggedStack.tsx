import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../strings';
import SignInFeedback from './SignInFeedback';
import Terms from './Terms';
import WelcomeScreen from './WelcomeScreen';
import { UnloggedStackParamList } from './types';

const UnloggedStack = createStackNavigator<UnloggedStackParamList>();
export default function () {
  return (
    <UnloggedStack.Navigator>
      <UnloggedStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false, title: '' }}
      />
      <UnloggedStack.Screen
        name="SignInFeedback"
        component={SignInFeedback}
        options={{ title: t('Verifique seu e-mail') }}
      />
      <UnloggedStack.Screen name="Terms" component={Terms} options={{ title: '' }} />
    </UnloggedStack.Navigator>
  );
}
