import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../common/screens/options';
import ProfileBlocked from '../../common/screens/profile/ProfileBlocked';

export type BlockedParamsList = {
  ProfileBlocked: undefined;
};

const Stack = createStackNavigator<BlockedParamsList>(); // TODO: add param list

export const BlockedNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="ProfileBlocked"
        component={ProfileBlocked}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
