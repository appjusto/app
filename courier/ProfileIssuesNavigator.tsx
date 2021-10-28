import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { defaultScreenOptions } from '../common/screens/options';
import { CommonProfileRejected } from '../common/screens/profile/CommonProfileRejected';
import ProfileBlocked from '../common/screens/profile/ProfileBlocked';
import { getCourier } from '../common/store/courier/selectors';

export type ProfileIssuesParamsList = {
  ProfileBlocked: undefined;
  CommonProfileRejected: undefined;
};

const Stack = createStackNavigator<ProfileIssuesParamsList>();

export const ProfileIssuesNavigator = () => {
  const courier = useSelector(getCourier);
  const situation = courier?.situation;
  let initialRouteName: 'CommonProfileRejected' | 'ProfileBlocked' | undefined = undefined;
  if (situation === 'rejected') initialRouteName = 'CommonProfileRejected';
  else initialRouteName = 'ProfileBlocked';
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
      <Stack.Screen
        name="CommonProfileRejected"
        component={CommonProfileRejected}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileBlocked"
        component={ProfileBlocked}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
