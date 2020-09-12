import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../../../common/components/buttons/BackButton';
import { t } from '../../../../strings';
import ChooseFleet from './ChooseFleet';
import CreateFleet from './CreateFleet';
import { FleetParamList } from './types';

const Stack = createStackNavigator<FleetParamList>();

export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChooseFleet"
        component={ChooseFleet}
        options={({ navigation }) => ({
          title: t('Escolha sua frota'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="CreateFleet"
        component={CreateFleet}
        options={({ navigation }) => ({
          title: t('Criar nova frota'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
