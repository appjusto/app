import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../common/components/views/ArrowBox';
import Chat from '../../common/screens/Chat';
import FleetDetail from '../../common/screens/fleet/FleetDetail';
import PermissionDeniedFeedback from '../../common/screens/PermissionDeniedFeedback';
import { t } from '../../strings';
import ProfileAddCard from '../profile/payment/ProfileAddCard';
import ProfilePaymentMethods from '../profile/payment/ProfilePaymentMethods';
import ProfileEdit from '../profile/ProfileEdit';
import Home from './Home';
import AddressComplete from './orders/AddressComplete';
import CancelOrder from './orders/CancelOrder';
import { OrderNavigator } from './orders/common/OrderNavigator';
import ConfirmCancelOrder from './orders/ConfirmCancelOrder';
import CourierDetail from './orders/CourierDetail';
import OngoingOrder from './orders/ongoing/OngoingOrder';
import OrderComplaint from './orders/OrderComplaint';
import OrderDeliveredFeedback from './orders/OrderDeliveredFeedback';
import OrderMatching from './orders/OrderMatching';
import OrderUnmatched from './orders/OrderUnmatched';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import TransportableItems from './orders/p2p-order/TransportableItems';
import RestaurantsNavigator from './restaurants/RestaurantsNavigator';
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
      {/* TO-DO: refactor screens related to order to its own navigator */}
      {/* remove */}
      <Stack.Screen
        name="CreateOrderP2P"
        component={CreateOrderP2P}
        options={{ title: t('Novo pedido') }}
      />
      {/* remove */}
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        options={{ title: t('Selecione o endereço') }}
      />
      {/* remove */}
      <Stack.Screen
        name="TransportableItems"
        component={TransportableItems}
        options={{ title: t('Informações Gerais') }}
      />
      {/* remove */}
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Detalhes da frota') }}
      />
      {/* remove */}
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Seus dados') }}
      />
      {/* remove */}
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
      />
      {/* remove */}
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
        options={{ title: t('Formas de pagamento') }}
      />
      {/* remove */}
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ headerShown: false }}
      />
      {/* remove */}
      <Stack.Screen
        name="OrderMatching"
        component={OrderMatching}
        options={{ headerShown: false }}
      />
      {/* remove */}
      <Stack.Screen
        name="OrderUnmatched"
        component={OrderUnmatched}
        options={{ headerShown: false }}
      />
      {/* remove */}
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={{ title: t('Pedido em andamento') }}
      />
      {/* remove */}
      <Stack.Screen
        name="CourierDetail"
        component={CourierDetail}
        options={{ title: t('Mais informações') }}
      />
      {/* remove */}
      <Stack.Screen
        name="OrderComplaint"
        component={OrderComplaint}
        options={{ title: t('Relatar um problema') }}
      />
      {/* remove */}
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Chat') }} />
      {/* //remove */}
      <Stack.Screen
        name="ConfirmCancelOrder"
        component={ConfirmCancelOrder}
        options={{ title: t('Cancelar pedido') }}
      />
      {/* //remove */}
      <Stack.Screen
        name="CancelOrder"
        component={CancelOrder}
        options={{ title: t('Sua opinião') }}
      />
      {/* //remove */}
      <Stack.Screen
        name="OrderDeliveredFeedback"
        component={OrderDeliveredFeedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderNavigator"
        component={OrderNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RestaurantsNavigator"
        component={RestaurantsNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
