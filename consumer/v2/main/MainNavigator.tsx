import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';
import * as icons from '../../../assets/icons';
import { colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import OrderHistory from './history/OrderHistory';
import Home from './home/Home';
import Profile from './profile/Profile';
import { MainNavigatorParamList } from './types';

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        title: 'B',
      }}
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green500,
        inactiveBackgroundColor: colors.white,
        style: { height: 60, justifyContent: 'center' },
        tabStyle: {
          borderRadius: 30,
          height: 40,
          marginTop: halfPadding,
        },
        labelStyle: { ...texts.xs, marginBottom: 4 },
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
