import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ProfileBlocked from '../../common/screens/profile/ProfileBlocked';

export type UnapprovedParamsList = {
  ProfileBlocked: undefined;
};

const Stack = createStackNavigator<UnapprovedParamsList>(); // TODO: add param list

export const UnapprovedNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileBlocked"
        component={ProfileBlocked}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
