import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import BackButton from '../../common/buttons/BackButton';
import ChooseFleet from './ChooseFleet';
import CreateFleet from './CreateFleet';

const Stack = createStackNavigator();

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
