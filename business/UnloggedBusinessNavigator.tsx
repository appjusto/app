import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../common/screens/options';
import SignInFeedback from '../common/screens/unlogged/SignInFeedback';
import Terms from '../common/screens/unlogged/Terms';
import { UnloggedParamList } from '../common/screens/unlogged/types';
import WelcomeScreen from '../common/screens/unlogged/WelcomeScreen';
import { t } from '../strings';

const Stack = createStackNavigator<UnloggedParamList>();
export const UnloggedBusinessNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ title: t('Entrar no AppJusto') }}
      />
      <Stack.Screen
        name="SignInFeedback"
        component={SignInFeedback}
        options={{ title: t('Verifique seu e-mail') }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
    </Stack.Navigator>
  );
};
