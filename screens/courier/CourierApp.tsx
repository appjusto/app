import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import AuthContainer from '../app/AuthContainer';
import ProfileStack from '../profile/ProfileStack';
import Unlogged from '../unlogged/UnloggedStack';
import HomeStack from './home/HomeStack';

const LoggedNavigator = createBottomTabNavigator();
function Logged() {
  return (
    <LoggedNavigator.Navigator>
      <LoggedNavigator.Screen name="Home" component={HomeStack} />
      <LoggedNavigator.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Sua conta' }}
      />
    </LoggedNavigator.Navigator>
  );
}

export default function () {
  return <AuthContainer Logged={Logged} Unlogged={Unlogged} />;
}
