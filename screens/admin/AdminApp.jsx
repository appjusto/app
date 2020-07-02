import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ConsumerApp from '../consumer/ConsumerApp';
import CourierApp from '../courier/CourierApp';

const Tab = createBottomTabNavigator();

export default function () {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Cliente" component={ConsumerApp} />
        <Tab.Screen name="Entregador" component={CourierApp} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}