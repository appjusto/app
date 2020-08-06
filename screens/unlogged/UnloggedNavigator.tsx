import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../strings';
import BackButton from '../common/buttons/BackButton';
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
        options={({ navigation }) => ({
          title: t('Verifique seu e-mail'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <StackNavigator.Screen
        name="Terms"
        component={Terms}
        options={({ navigation }) => ({
          title: t('Fique por dentro'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </StackNavigator.Navigator>
  );
}
