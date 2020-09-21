import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../common/components/buttons/BackButton';
import Chat from '../../common/screens/Chat';
import ProfileEdit from '../../common/screens/profile/ProfileEdit';
import OrderRefused from '../../courier/approved/matching/OrderRefused';
import { t } from '../../strings';
import ProfileAddCard from '../profile/payment/ProfileAddCard';
import ProfilePaymentMethods from '../profile/payment/ProfilePaymentMethods';
import Home from './Home';
import AddressComplete from './orders/AddressComplete';
import OngoingOrder from './orders/OngoingOrder';
import OrderConfirmedFeedback from './orders/OrderConfirmedFeedback';
import OrderDeliveredFeedback from './orders/OrderDeliveredFeedback';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import { HomeNavigatorParamList } from './types';

const Stack = createStackNavigator<HomeNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
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
        name="OrderConfirmedFeedback"
        component={OrderConfirmedFeedback}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={({ navigation }) => ({
          title: t('Pedido em andamento'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ navigation }) => ({
          title: t('Conversa'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="OrderDeliveredFeedback"
        component={OrderDeliveredFeedback}
        options={{
          headerShown: false,
        }}
      />
      {/* just for testing */}
      <Stack.Screen
        name="OrderRefused"
        component={OrderRefused}
        options={({ navigation }) => ({
          title: t('Recusou o pedido'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
