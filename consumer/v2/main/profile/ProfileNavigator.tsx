import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import ProfileErase from '../../../../common/screens/profile/ProfileErase';
import { t } from '../../../../strings';
import PaymentMethodDetail from './PaymentMethodDetail';
import ProfileAddCard from './ProfileAddCard';
import ProfileEdit from './ProfileEdit';
import ProfilePaymentMethods from './ProfilePaymentMethods';
import Terms from './Terms';
import { ProfileParamList } from './types';

const Stack = createStackNavigator<ProfileParamList>();
export default function () {
  return (
    <Stack.Navigator initialRouteName="ProfileEdit" screenOptions={{ ...defaultScreenOptions }}>
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
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
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Termos de uso') }} />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={{ title: t('Excluir minha conta') }}
      />
    </Stack.Navigator>
  );
}
