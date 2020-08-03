import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import EraseConfirmed from './EraseConfirmed';
import ConsumerProfile from './Profile';
import ProfileEdit from './ProfileEdit';
import ProfileErase from './ProfileErase';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator initialRouteName="ConsumerProfile">
      <Stack.Screen name="ConsumerProfile" component={ConsumerProfile} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ title: 'Seus dados' }} />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={{ title: 'Excluir minha conta' }}
      />
      <Stack.Screen name="EraseConfirmed" component={EraseConfirmed} />
    </Stack.Navigator>
  );
}
