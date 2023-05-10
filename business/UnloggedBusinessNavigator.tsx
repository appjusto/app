import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../common/screens/options';
import Terms from '../common/screens/unlogged/Terms';
import WelcomeScreen from '../common/screens/unlogged/WelcomeScreen';
import { UnloggedParamList } from '../common/screens/unlogged/types';
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
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
    </Stack.Navigator>
  );
};
