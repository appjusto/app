import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../common/components/buttons/BackButton';
import ProfileEdit from '../../common/screens/profile/ProfileEdit';
import ProfileErase from '../../common/screens/profile/ProfileErase';
import Terms from '../../common/screens/unlogged/Terms';
import { t } from '../../strings';
import Profile from './Profile';
import ProfileAddCard from './payment/ProfileAddCard';
import ProfilePaymentMethods from './payment/ProfilePaymentMethods';
import { ProfileParamList } from './types';

const Stack = createStackNavigator<ProfileParamList>();
export default function () {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={({ navigation }) => ({
          title: t('Dados pessoais'),
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
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={({ navigation }) => ({
          title: t('Adicionar cartão'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={({ navigation }) => ({
          title: t('Termos de uso'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={({ navigation }) => ({
          title: t('Excluir minha conta'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
