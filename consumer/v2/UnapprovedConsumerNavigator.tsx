import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { defaultScreenOptions } from '../../common/screens/options';
import { CommonProfileRejected } from '../../common/screens/profile/CommonProfileRejected';
import ProfileBlocked from '../../common/screens/profile/ProfileBlocked';
import { getConsumer } from '../../common/store/consumer/selectors';

export type UnapprovedConsumerParamsList = {
  ProfileBlocked: undefined;
  CommonProfileRejected: undefined;
};

const Stack = createStackNavigator<UnapprovedConsumerParamsList>(); // TODO: add param list

export const UnapprovedConsumerNavigator = () => {
  // redux
  const consumer = useSelector(getConsumer);
  // helpers
  let initialRouteName: 'ProfileBlocked' | 'CommonProfileRejected' | undefined = undefined;
  if (consumer?.situation === 'blocked') initialRouteName = 'ProfileBlocked';
  else if (consumer?.situation === 'rejected') initialRouteName = 'CommonProfileRejected';
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
      <Stack.Screen
        name="ProfileBlocked"
        component={ProfileBlocked}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommonProfileRejected"
        component={CommonProfileRejected}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
