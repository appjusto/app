import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../strings';
import SignInFeedback from './SignInFeedback';
import Terms from './Terms';
import BackButton from '../common/BackButton';
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
        options={({ navigation }) => ({
          title: t('Verifique seu e-mail'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <UnloggedStack.Screen
        name="Terms"
        component={Terms}
        options={({ navigation }) => ({
          title: t('Fique por dentro'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </UnloggedStack.Navigator>
  );
}
