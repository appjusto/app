import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import ProfileErase from '../../../../common/screens/profile/ProfileErase';
import Terms from '../../../../common/screens/unlogged/Terms';
import { t } from '../../../../strings';
import BankNavigator from './bank/BankNavigator';
import FleetNavigator from './fleet/FleetNavigator';
import ProfilePhotos from './photos/ProfilePhotos';
import Profile from './Profile';
import ProfileCompany from './ProfileCompany';
import ProfileEdit from './ProfileEdit';
import { CourierProfileParamList } from './types';

const Stack = createStackNavigator<CourierProfileParamList>();
export default function () {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Profile" component={Profile} options={{ title: t('Sua conta') }} />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Dados pessoais') }}
      />
      <Stack.Screen
        name="ProfileCompany"
        component={ProfileCompany}
        options={{ title: t('Dados da empresa') }}
      />
      <Stack.Screen
        name="ProfilePhotos"
        component={ProfilePhotos}
        options={{ title: t('Fotos & Documentos') }}
      />
      <Stack.Screen
        name="BankNavigator"
        component={BankNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FleetNavigator"
        component={FleetNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={{ title: t('Excluir minha conta') }}
      />
    </Stack.Navigator>
  );
}
