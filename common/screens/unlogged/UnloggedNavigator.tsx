import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { FoodOrderNavigator } from '../../../consumer/v2/food/FoodOrderNavigator';
import Home from '../../../consumer/v2/main/home/Home';
import { t } from '../../../strings';
import { defaultScreenOptions } from '../options';
import SignInFeedback from './SignInFeedback';
import Terms from './Terms';
import { UnloggedParamList } from './types';
import WelcomeScreen from './WelcomeScreen';

const Stack = createStackNavigator<UnloggedParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="FoodOrderNavigator"
        component={FoodOrderNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignInFeedback"
        component={SignInFeedback}
        options={{ title: t('Verifique seu e-mail') }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
    </Stack.Navigator>
  );
}
