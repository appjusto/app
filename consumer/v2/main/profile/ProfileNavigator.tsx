import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { AboutApp } from '../../../../common/screens/profile/AboutApp';
import { CommonProfileEdit } from '../../../../common/screens/profile/CommonProfileEdit';
import ProfileErase from '../../../../common/screens/profile/ProfileErase';
import Terms from '../../../../common/screens/unlogged/Terms';
import { t } from '../../../../strings';
import PaymentMethodDetail from './PaymentMethodDetail';
import ProfileAddCard from './ProfileAddCard';
import ProfileEdit from './ProfileEdit';
import ProfilePaymentMethods from './ProfilePaymentMethods';
import { RequestProfileEdit } from './RequestProfileEdit';
import { ProfileParamList } from './types';

const Stack = createStackNavigator<ProfileParamList>();
export default function () {
  return (
    <Stack.Navigator initialRouteName="ProfileEdit" screenOptions={{ ...defaultScreenOptions }}>
      {/* TODO: delete this screen after finishing the new one */}
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Dados pessoais') }}
      />
      <Stack.Screen
        name="CommonProfileEdit"
        component={CommonProfileEdit}
        options={{ title: t('Dados pessoais') }}
      />
      <Stack.Screen
        name="RequestProfileEdit"
        component={RequestProfileEdit}
        options={{ title: t('Dados pessoais') }}
      />
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
      />
      <Stack.Screen
        name="PaymentMethodDetail"
        component={PaymentMethodDetail}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{ title: t('Sobre o AppJusto') }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Termos de uso') }} />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={{ title: t('Excluir minha conta') }}
      />
    </Stack.Navigator>
  );
}
