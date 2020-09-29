import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../../../common/components/views/ArrowBox';
import { t } from '../../../../strings';
import ProfileBank from './ProfileBank';
import SelectBank from './SelectBank';
import { BankParamList } from './types';

const Stack = createStackNavigator<BankParamList>();

export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="ProfileBank" component={ProfileBank} />
      <Stack.Screen
        name="SelectBank"
        component={SelectBank}
        options={{ title: t('Escolha seu banco') }}
      />
    </Stack.Navigator>
  );
}
