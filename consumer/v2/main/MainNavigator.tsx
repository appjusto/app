import { PushMessageData } from '@appjusto/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import * as icons from '../../../assets/icons';
import { track } from '../../../common/store/api/track';
import { halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import OrderHistory from './history/OrderHistory';
import Home from './home/Home';
import Profile from './profile/Profile';
import { MainNavigatorParamList } from './types';
import { useNotificationHandler } from './useNotificationHandler';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'MainNavigator'>;

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

export const MainNavigator = () => {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  // handlers
  const handler = React.useCallback(
    (data: PushMessageData, clicked?: boolean, remove?: () => void) => {
      if (data.action === 'order-update') {
        if (clicked) {
          remove!();
          track('consumer clicked in order-update push');
          navigation.navigate('OngoingOrderNavigator', {
            screen: 'OngoingOrder',
            params: {
              orderId: data.orderId,
            },
          });
        }
      } else if (data.action === 'order-chat') {
        if (clicked) {
          remove!();
          track('consumer clicked in order-chat push');
          navigation.navigate('OngoingOrderNavigator', {
            screen: 'OngoingOrder',
            params: {
              orderId: data.orderId,
              chatFrom: data.from,
            },
          });
        }
      }
    },
    [navigation]
  );
  useNotificationHandler('order-update', handler);
  useNotificationHandler('order-chat', handler);

  const { width } = Dimensions.get('window');
  // UI
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          height: 65,
          paddingVertical: 20,
          paddingHorizontal: padding,
          width,
        },
        tabStyle: {
          height: 24,
          alignContent: 'flex-start',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                left: -16,
              }}
            >
              <Image
                source={focused ? icons.homeFocused : icons.home}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: halfPadding,
                }}
              />
              <Text style={{ ...texts.xs, fontFamily: focused ? 'BarlowBold' : 'BarlowMedium' }}>
                {t('Início')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                left: -8,
              }}
            >
              <Image
                source={focused ? icons.ordersFocused : icons.orders}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: halfPadding,
                }}
              />
              <Text style={{ ...texts.xs, fontFamily: focused ? 'BarlowBold' : 'BarlowMedium' }}>
                {t('Seus pedidos')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Image
                source={focused ? icons.userFocused : icons.user}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: halfPadding,
                }}
              />
              <Text style={{ ...texts.xs, fontFamily: focused ? 'BarlowBold' : 'BarlowMedium' }}>
                {t('Sua conta')}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
