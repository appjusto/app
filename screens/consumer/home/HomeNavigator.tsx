import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import AddressComplete from '../../common/AddressComplete';
import BackButton from '../../common/buttons/BackButton';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import ConsumerHome from './ConsumerHome';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConsumerHome"
        component={ConsumerHome}
        options={{ headerShown: false, title: '' }}
      />
      <Stack.Screen
        name="CreateOrderP2P"
        component={CreateOrderP2P}
        options={({ navigation }) => ({
          title: t('Novo pedido'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        options={({ navigation }) => ({
          title: t('Adicionar endereço'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
