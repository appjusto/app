import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../../../../common/components/views/ArrowBox';
import FleetDetail from '../../../../../common/screens/fleet/FleetDetail';
import { t } from '../../../../../strings';
import AllFleets from './AllFleets';
import ChooseFleet from './ChooseFleet';
import CreateFleet from './CreateFleet';
import { FleetParamList } from './types';

const Stack = createStackNavigator<FleetParamList>();

export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen
        name="ChooseFleet"
        component={ChooseFleet}
        options={{ title: t('Escolha sua frota') }}
      />
      <Stack.Screen
        name="CreateFleet"
        component={CreateFleet}
        options={{ title: t('Criar nova frota') }}
      />
      <Stack.Screen
        name="AllFleets"
        component={AllFleets}
        options={{ title: t('Todas as frotas disponíveis') }}
      />
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Todas as frotas disponíveis') }}
      />
    </Stack.Navigator>
  );
}
