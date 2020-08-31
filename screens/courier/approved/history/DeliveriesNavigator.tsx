import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../../strings';
import BackButton from '../../../common/buttons/BackButton';
import DeliveryHistory from './DeliveryHistory';
import OngoingOrder from './OngoingOrder';
import { HistoryNavigatorParamList } from './types';

const Stack = createStackNavigator<HistoryNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeliveryHistory"
        component={DeliveryHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={({ navigation }) => ({
          title: t('Corrida em andamento'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
