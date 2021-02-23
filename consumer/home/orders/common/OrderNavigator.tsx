import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../../../common/components/views/ArrowBox';
import Chat from '../../../../common/screens/Chat';
import FleetDetail from '../../../../common/screens/fleet/FleetDetail';
import { SendIssuesScreen } from '../../../../common/screens/SendIssuesScreen';
import { t } from '../../../../strings';
import ProfileAddCard from '../../../profile/payment/ProfileAddCard';
import ProfilePaymentMethods from '../../../profile/payment/ProfilePaymentMethods';
import ProfileEdit from '../../../profile/ProfileEdit';
import AddressComplete from '../AddressComplete';
import CancelOrder from '../CancelOrder';
import ConfirmCancelOrder from '../ConfirmCancelOrder';
import CourierDetail from '../CourierDetail';
import OngoingOrder from '../ongoing/OngoingOrder';
import OrderComplaint from '../OrderComplaint';
import OrderConfirming from '../OrderConfirming';
import OrderDeliveredFeedback from '../OrderDeliveredFeedback';
import OrderNoMatch from '../OrderNoMatch';
import CreateOrderP2P from '../p2p-order/CreateOrderP2P';
import TransportableItems from '../p2p-order/TransportableItems';
import { OrderNavigatorParamList } from '../types';

const Stack = createStackNavigator<OrderNavigatorParamList>();

export const OrderNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
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
        name="OrderConfirming"
        component={OrderConfirming}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="OrderNoMatch" component={OrderNoMatch} options={{ headerShown: false }} />
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
      {/* TODO :add dynamic title */}
      <Stack.Screen
        name="SendIssuesScreen"
        component={SendIssuesScreen}
        options={{ title: t('Indique seu problema') }}
      />
      <Stack.Screen
        name="OrderComplaint"
        component={OrderComplaint}
        options={{ title: t('Relatar um problema') }}
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
};
