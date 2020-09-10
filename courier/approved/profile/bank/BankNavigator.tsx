import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../../../common/components/buttons/BackButton';
import { t } from '../../../../strings';
import ProfileBank from './ProfileBank';
import SelectBank from './SelectBank';
import { BankParamList } from './types';

const Stack = createStackNavigator<BankParamList>();

export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileBank" component={ProfileBank} />
      <Stack.Screen
        name="SelectBank"
        component={SelectBank}
        options={({ navigation }) => ({
          title: t('Escolha seu banco'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
