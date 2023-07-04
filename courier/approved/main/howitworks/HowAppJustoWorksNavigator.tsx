import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import { HowAppJustoWorks } from './HowAppJustoWorks';
import { ApprovalProcess } from './approval/ApprovalProcess';
import { FleetProcess } from './fleets/FleetProcess';
import { RevenueProcess } from './revenue/RevenueProcess';
import { HowAppJustoWorksParams } from './types';

const Stack = createStackNavigator<HowAppJustoWorksParams>();

export const HowAppJustoWorksNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="HowAppJustoWorks"
        component={HowAppJustoWorks}
        options={{ title: t('Corrida funciona o AppJusto') }}
      />
      <Stack.Screen
        name="ApprovalProcess"
        component={ApprovalProcess}
        options={{ title: t('Aprovação de cadastro') }}
      />
      <Stack.Screen
        name="RevenueProcess"
        component={RevenueProcess}
        options={{ title: t('Recebimento') }}
      />
      <Stack.Screen name="FleetProcess" component={FleetProcess} options={{ title: t('Frotas') }} />
    </Stack.Navigator>
  );
};
