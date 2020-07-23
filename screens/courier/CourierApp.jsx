import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CourierHome from './home/CourierHome';
import Matching from './matching/Matching';

const CourierRootNavigator = createStackNavigator();
function CourierRoot() {
  return (
    <CourierRootNavigator.Navigator>
      <CourierRootNavigator.Screen name='Home' component={CourierHome} />
      <CourierRootNavigator.Screen name='Matching' component={Matching} />
    </CourierRootNavigator.Navigator>
  );
}

export default function () {
  return (
    <CourierRoot />
  );
}