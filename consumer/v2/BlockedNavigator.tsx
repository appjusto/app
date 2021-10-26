import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { defaultScreenOptions } from '../../common/screens/options';
import ProfileBlocked from '../../common/screens/profile/ProfileBlocked';
import { getConsumer } from '../../common/store/consumer/selectors';

export type BlockedParamsList = {
  ProfileBlocked: undefined;
};

const Stack = createStackNavigator<BlockedParamsList>(); // TODO: add param list

export const BlockedNavigator = () => {
  // redux
  const consumer = useSelector(getConsumer);

  let initialRouteName: 'ProfileBlocked' | undefined = undefined;
  if (consumer?.situation === 'blocked') initialRouteName === 'ProfileBlocked';
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
      <Stack.Screen
        name="ProfileBlocked"
        component={ProfileBlocked}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
