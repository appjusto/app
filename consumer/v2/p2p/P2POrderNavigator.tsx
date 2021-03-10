import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../common/screens/options';
import { t } from '../../../strings';
import { AddressComplete } from '../common/AddressComplete';
import FleetDetail from '../common/FleetDetail';
import ProfileAddCard from '../main/profile/ProfileAddCard';
import ProfilePaymentMethods from '../main/profile/ProfilePaymentMethods';
import CreateOrderP2P from './CreateOrderP2P';
import { TransportableItems } from './TransportableItems';
import { P2POrderNavigatorParamList } from './types';

const Stack = createStackNavigator<P2POrderNavigatorParamList>();

export const P2POrderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="CreateOrderP2P"
        component={CreateOrderP2P}
        options={{ title: t('Entrega de encomenda') }}
      />
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        options={{ title: t('Selecione o endereço') }}
      />
      <Stack.Screen
        name="TransportableItems"
        component={TransportableItems}
        options={{ title: t('O que pode ser transportado') }}
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
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Detalhes da frota') }}
      />
      {/*
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Seus dados') }}
      />
      
      <Stack.Screen
        name="CourierDetail"
        component={CourierDetail}
        options={{ title: t('Mais informações') }}
      />
      <Stack.Screen
        name="ReportIssueOngoingOrder"
        component={ReportIssue}
        options={{ title: t('Relatar um problema') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Chat') }} />
      <Stack.Screen
        name="OrderDeliveredFeedback"
        component={OrderDeliveredFeedback}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};
