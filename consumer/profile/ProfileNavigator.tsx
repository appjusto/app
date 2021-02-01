import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../common/components/views/ArrowBox';
import ProfileErase from '../../common/screens/profile/ProfileErase';
import Terms from '../../common/screens/unlogged/Terms';
import { t } from '../../strings';
import PaymentMethodDetail from './payment/PaymentMethodDetail';
import ProfileAddCard from './payment/ProfileAddCard';
import ProfilePaymentMethods from './payment/ProfilePaymentMethods';
import Profile from './Profile';
import ProfileEdit from './ProfileEdit';
import { ProfileParamList } from './types';

const Stack = createStackNavigator<ProfileParamList>();
export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Profile" component={Profile} options={{ title: t('Sua conta') }} />
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
        name="PaymentMethodDetail"
        component={PaymentMethodDetail}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
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
