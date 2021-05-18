import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';
import * as icons from '../../../assets/icons';
import { colors, texts } from '../../../common/styles';
import { t } from '../../../strings';
import OrderHistory from './history/OrderHistory';
import Home from './home/Home';
import Profile from './profile/Profile';
import { MainNavigatorParamList } from './types';
import { useNotificationHandler } from './useNotificationHandler';

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

export const MainNavigator = () => {
  useNotificationHandler();
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green500,
        inactiveBackgroundColor: colors.white,
        style: { height: 65, paddingHorizontal: 4 },
        tabStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 32,
          height: 36,
          marginTop: 8,
        },
        labelStyle: { ...texts.xs, marginBottom: 5 },
        labelPosition: 'beside-icon',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('Início'),
          tabBarIcon: () => <Image source={icons.home} style={{ marginBottom: 5 }} />,
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          title: t('Seus pedidos'),
          tabBarIcon: () => <Image source={icons.orders} style={{ marginBottom: 5 }} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: t('Sua conta'),
          tabBarIcon: () => <Image source={icons.user} style={{ marginBottom: 5 }} />,
        }}
      />
    </Tab.Navigator>
  );
};
