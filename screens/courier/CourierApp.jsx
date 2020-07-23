import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CourierHome from './home/CourierHome';
import Matching from './matching/Matching';

const CourierRootNavigator = createStackNavigator();
function CourierRoot() {
  return (
    <NavigationContainer>
      <CourierRootNavigator.Navigator>
        <CourierRootNavigator.Screen name='Home' component={CourierHome} />
        <CourierRootNavigator.Screen name='Matching' component={Matching} />
      </CourierRootNavigator.Navigator>
    </NavigationContainer>
  );
}

export default function () {
  return (
    <CourierRoot />
  );
}