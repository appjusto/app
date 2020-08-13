import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import BackButton from '../../common/buttons/BackButton';
import OrderDetail from './OrderDetail';
import OrderHistory from './OrderHistory';
import { HistoryNavigatorParamList } from './types';

const Stack = createStackNavigator<HistoryNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={({ navigation }) => ({
          title: t('Histórico de pedidos'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={({ navigation }) => ({
          title: t('Histórico de pedidos'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
