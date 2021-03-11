import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PushMessage } from 'appjusto-types';
import React from 'react';
import { Image } from 'react-native';
import { useQuery } from 'react-query';
import * as icons from '../../../assets/icons';
import { colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import OrderHistory from './history/OrderHistory';
import Home from './home/Home';
import Profile from './profile/Profile';
import { MainNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'MainNavigator'>;

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

export const MainNavigator = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const chatQuery = useQuery<PushMessage[]>(['notifications', 'order-chat'], () => []);
  React.useEffect(() => {
    if (!chatQuery.data || chatQuery.data.length === 0) return;
    const [notification] = chatQuery.data;
    if (notification.clicked) {
      navigation.navigate('OngoingOrderNavigator', {
        screen: 'OngoingOrder',
        params: {
          orderId: notification.data.orderId,
          newMessage: true,
        },
      });
    }
  }, [chatQuery.data, navigation]);
  return (
    <Tab.Navigator
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
