import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../strings';
import SignInFeedback from './SignInFeedback';
import Terms from './Terms';
import BackButton from '../common/BackButton';
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
      <UnloggedStack.Screen
        name="Terms"
        component={Terms}
        options={({ navigation }) => ({
          title: t('Fique por dentro'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
<<<<<<< HEAD:screens/unlogged/UnloggedStack.tsx
    </UnloggedStack.Navigator>
=======
      <StackNavigator.Screen name="Terms" component={Terms} options={{ title: '' }} />
    </StackNavigator.Navigator>
>>>>>>> bf8b7580f56711a9c14670f62789150232671564:screens/unlogged/UnloggedNavigator.tsx
  );
}
