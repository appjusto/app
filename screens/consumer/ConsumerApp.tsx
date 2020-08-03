import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AuthContainer from '../app/AuthContainer';
import ProfileStack from '../profile/ProfileStack';
import UnloggedStack from '../unlogged/UnloggedStack';
import ConsumerHistory from './history/ConsumerHistory';
import HomeStack from './home/HomeStack';

const HistoryStack = createStackNavigator();
function History() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="ConsumerHistory" component={ConsumerHistory} />
    </HistoryStack.Navigator>
  );
}

const LoggedNavigator = createBottomTabNavigator();
function Logged() {
  return (
    <LoggedNavigator.Navigator>
      <LoggedNavigator.Screen name="Home" component={HomeStack} />
      <LoggedNavigator.Screen name="ConsumerHistory" component={History} />
      <LoggedNavigator.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Sua conta' }}
      />
    </LoggedNavigator.Navigator>
  );
}

export default function () {
  return <AuthContainer Logged={Logged} Unlogged={UnloggedStack} />;
}
