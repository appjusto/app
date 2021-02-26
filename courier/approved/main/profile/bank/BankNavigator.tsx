import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../../common/screens/options';
import { t } from '../../../../../strings';
import ProfileBank from './ProfileBank';
import SelectBank from './SelectBank';
import { BankParamList } from './types';

const Stack = createStackNavigator<BankParamList>();

export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="ProfileBank"
        component={ProfileBank}
        options={{ title: t('Dados bancários') }}
      />
      <Stack.Screen
        name="SelectBank"
        component={SelectBank}
        options={{ title: t('Escolha seu banco') }}
      />
    </Stack.Navigator>
  );
}
