import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import ProfileStack from '../../profile/ProfileStack';
import HomeNavigator from './home/HomeNavigator';

const Tab = createBottomTabNavigator();
export default function () {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Sua conta' }} />
    </Tab.Navigator>
  );
}
