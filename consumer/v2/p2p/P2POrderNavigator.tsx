import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FleetDetail from '../../../common/screens/fleet/FleetDetail';
import { defaultScreenOptions } from '../../../common/screens/options';
import { CommonProfileEdit } from '../../../common/screens/profile/CommonProfileEdit';
import { PhoneVerificationScreen } from '../../../common/screens/profile/PhoneVerificationScreen';
import { t } from '../../../strings';
import { AddressComplete } from '../common/AddressComplete';
import { AvailableFleets } from '../common/AvailableFleets';
import { PayWithPix } from '../common/PayWithPix';
import ProfileAddCard from '../main/profile/ProfileAddCard';
import ProfilePaymentMethods from '../main/profile/ProfilePaymentMethods';
import { SelectPaymentMethod } from '../main/profile/SelectPaymentMethod';
import { AboutCharges } from './AboutCharges';
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
        options={{ title: t('Encomenda') }}
      />
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        options={{ title: t('Selecione o endereço') }}
      />
      <Stack.Screen
        name="TransportableItems"
        component={TransportableItems}
        options={{ title: t('Sobre as encomendas') }}
      />
      <Stack.Screen
        name="CommonProfileEdit"
        component={CommonProfileEdit}
        options={{ title: t('Adicionar cartão') }}
      />
      <Stack.Screen
        name="PhoneVerificationScreen"
        component={PhoneVerificationScreen}
        options={{ title: t('Verificação de telefone') }}
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
        name="PayWithPix"
        component={PayWithPix}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
        options={{ title: t('Selecionar pagamento') }}
      />
      <Stack.Screen
        name="AboutCharges"
        component={AboutCharges}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Detalhes da frota') }}
      />
      <Stack.Screen
        name="AvailableFleets"
        component={AvailableFleets}
        options={{ title: t('Frotas disponíveis') }}
      />
    </Stack.Navigator>
  );
};
