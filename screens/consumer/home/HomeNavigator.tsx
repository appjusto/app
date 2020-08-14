import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import BackButton from '../../common/buttons/BackButton';
import ProfileEdit from '../../profile/ProfileEdit';
import ProfileAddCard from '../../profile/payment/ProfileAddCard';
import ProfilePaymentMethods from '../../profile/payment/ProfilePaymentMethods';
import Home from './Home';
import AddressComplete from './orders/AddressComplete';
import OrderFeedback from './orders/OrderFeedback';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import { HomeNavigatorParamList } from './types';

const Stack = createStackNavigator<HomeNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false, title: '' }} />
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
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={({ navigation }) => ({
          title: t('Seus dados'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={({ navigation }) => ({
          title: t('Adicionar cartão'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
        options={({ navigation }) => ({
          title: t('Formas de pagamento'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="OrderFeedback"
        component={OrderFeedback}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
