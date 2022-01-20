import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../common/screens/options';
import { MainBusinessNavigator } from './MainBusinessNavigator';

//TODO: create and add params list
const Stack = createStackNavigator();

export const LoggedBusinessNavigator = () => {
  //TODO: wrap this stack with the right context
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name="MainBusinessNavigator"
      component={MainBusinessNavigator}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>;
};
