import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import ProfileNavigator from '../../profile/ProfileNavigator';
import HomeNavigator from './home/HomeNavigator';

const Tab = createBottomTabNavigator();
export default function () {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{ title: 'Sua conta' }} />
    </Tab.Navigator>
  );
}
