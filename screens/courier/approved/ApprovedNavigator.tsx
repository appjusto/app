import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';

import * as icons from '../../../assets/icons';
import { t } from '../../../strings';
import ProfileNavigator from '../../profile/ProfileNavigator';
import HomeNavigator from './home/HomeNavigator';

const Tab = createBottomTabNavigator();
export default function () {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{ title: t('Início'), tabBarIcon: () => <Image source={icons.home} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ title: t('Sua conta'), tabBarIcon: () => <Image source={icons.user} /> }}
      />
    </Tab.Navigator>
  );
}
