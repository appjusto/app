import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../common/components/views/ArrowBox';
import Chat from '../../common/screens/Chat';
import PermissionDeniedFeedback from '../../common/screens/PermissionDeniedFeedback';
import FleetDetail from '../../common/screens/fleet/FleetDetail';
import { t } from '../../strings';
import ProfileEdit from '../profile/ProfileEdit';
import ProfileAddCard from '../profile/payment/ProfileAddCard';
import ProfilePaymentMethods from '../profile/payment/ProfilePaymentMethods';
import Home from './Home';
import AddressComplete from './orders/AddressComplete';
import CancelOrder from './orders/CancelOrder';
import ConfirmCancelOrder from './orders/ConfirmCancelOrder';
import CourierDetail from './orders/CourierDetail';
import OngoingOrder from './orders/OngoingOrder';
import OrderDeliveredFeedback from './orders/OrderDeliveredFeedback';
import OrderMatching from './orders/OrderMatching';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import ReviewCourier from './orders/p2p-order/ReviewCourier';
import TransportableItems from './orders/p2p-order/TransportableItems';
import { HomeNavigatorParamList } from './types';

const Stack = createStackNavigator<HomeNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateOrderP2P"
        component={CreateOrderP2P}
        options={{ title: t('Novo pedido') }}
      />
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        options={{ title: t('Selecione o endereço') }}
      />
      <Stack.Screen
        name="TransportableItems"
        component={TransportableItems}
        options={{ title: t('Informações Gerais') }}
      />
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Detalhes da frota') }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Seus dados') }}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
      />
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderMatching"
        component={OrderMatching}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={{ title: t('Pedido em andamento') }}
      />
      <Stack.Screen
        name="CourierDetail"
        component={CourierDetail}
        options={{ title: t('Mais informações') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Chat') }} />
      <Stack.Screen
        name="ConfirmCancelOrder"
        component={ConfirmCancelOrder}
        options={{ title: t('Cancelar pedido') }}
      />
      <Stack.Screen
        name="CancelOrder"
        component={CancelOrder}
        options={{ title: t('Sua opinião') }}
      />
      <Stack.Screen
        name="OrderDeliveredFeedback"
        component={OrderDeliveredFeedback}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
