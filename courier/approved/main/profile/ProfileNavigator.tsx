import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FleetDetail from '../../../../common/screens/fleet/FleetDetail';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { AboutApp } from '../../../../common/screens/profile/AboutApp';
import { CommonProfileEdit } from '../../../../common/screens/profile/CommonProfileEdit';
import ProfileErase from '../../../../common/screens/profile/ProfileErase';
import Terms from '../../../../common/screens/unlogged/Terms';
import { t } from '../../../../strings';
import ProfileBank from './bank/ProfileBank';
import SelectBank from './bank/SelectBank';
import AllFleets from './fleet/AllFleets';
import ChooseFleet from './fleet/ChooseFleet';
import CreateFleet from './fleet/CreateFleet';
import { PartnersAndDiscounts } from './PartnersAndDiscounts';
import ProfilePhotos from './photos/ProfilePhotos';
import ProfileCompany from './ProfileCompany';
import ProfileEdit from './ProfileEdit';
import { CourierProfileParamList } from './types';

const Stack = createStackNavigator<CourierProfileParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
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
        name="ProfileCompany"
        component={ProfileCompany}
        options={{ title: t('Dados da empresa') }}
      />
      <Stack.Screen
        name="ProfilePhotos"
        component={ProfilePhotos}
        options={{ title: t('Fotos e Documentos') }}
      />
      <Stack.Screen
        name="ProfileBank"
        component={ProfileBank}
        options={{ title: t('Dados bancários') }}
      />
      <Stack.Screen
        name="SelectBank"
        component={SelectBank}
        options={{ title: t('Escolha seu banco') }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{ title: t('Sobre o AppJusto') }}
      />
      <Stack.Screen
        name="PartnersAndDiscounts"
        component={PartnersAndDiscounts}
        options={{ title: t('Descontos em parceiros') }}
      />
      <Stack.Screen
        name="ChooseFleet"
        component={ChooseFleet}
        options={{ title: t('Escolha sua frota') }}
      />
      <Stack.Screen
        name="CreateFleet"
        component={CreateFleet}
        options={{ title: t('Criar nova frota') }}
      />
      <Stack.Screen
        name="AllFleets"
        component={AllFleets}
        options={{ title: t('Todas as frotas disponíveis') }}
      />
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Detalhes da frota') }}
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
