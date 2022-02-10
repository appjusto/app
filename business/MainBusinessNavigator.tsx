import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import * as icons from '../assets/icons';
import { halfPadding, padding, texts } from '../common/styles';
import { t } from '../strings';
import { BusinessOptions } from './options/BusinessOptions';
import { OrdersManager } from './orders/OrdersManager';

//TODO: create and add params list
const Tab = createBottomTabNavigator();

export const MainBusinessNavigator = () => {
  //TODO: handle push messages (new orders... what else?)
  // helpers
  const { width } = Dimensions.get('window');
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
        name="BusinessOrders"
        component={OrdersManager}
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
                source={focused ? icons.ordersFocused : icons.orders}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: halfPadding,
                }}
              />
              <Text style={{ ...texts.xs, fontFamily: focused ? 'BarlowBold' : 'BarlowMedium' }}>
                {t('Pedidos')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="BusinessOptions"
        component={BusinessOptions}
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
