import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { defaultScreenOptions } from '../../common/screens/options';
import { CommonProfileProblems } from '../../common/screens/profile/CommonProfileProblems';
import ProfileBlocked from '../../common/screens/profile/ProfileBlocked';
import { getConsumer } from '../../common/store/consumer/selectors';

export type UnapprovedConsumerParamsList = {
  ProfileBlocked: undefined;
  CommonProfileProblems: undefined;
};

const Stack = createStackNavigator<UnapprovedConsumerParamsList>(); // TODO: add param list

export const UnapprovedConsumerNavigator = () => {
  // redux
  const consumer = useSelector(getConsumer);
  // helpers
  let initialRouteName: 'ProfileBlocked' | 'CommonProfileProblems' | undefined = undefined;
  if (consumer?.situation === 'blocked') initialRouteName = 'ProfileBlocked';
  else initialRouteName = 'CommonProfileProblems';
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
      <Stack.Screen
        name="ProfileBlocked"
        component={ProfileBlocked}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommonProfileProblems"
        component={CommonProfileProblems}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
