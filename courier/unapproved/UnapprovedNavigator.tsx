import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import FleetDetail from '../../common/screens/fleet/FleetDetail';
import { defaultScreenOptions } from '../../common/screens/options';
import { PermissionDenied } from '../../common/screens/PermissionDenied';
import { AboutApp } from '../../common/screens/profile/AboutApp';
import { CommonProfileEdit } from '../../common/screens/profile/CommonProfileEdit';
import ProfileErase from '../../common/screens/profile/ProfileErase';
import { Onboarding } from '../../common/screens/unlogged/onboarding/Onboarding';
import { getCourier } from '../../common/store/courier/selectors';
import { t } from '../../strings';
import ProfileBank from '../approved/main/profile/bank/ProfileBank';
import SelectBank from '../approved/main/profile/bank/SelectBank';
import AllFleets from '../approved/main/profile/fleet/AllFleets';
import ChooseFleet from '../approved/main/profile/fleet/ChooseFleet';
import CreateFleet from '../approved/main/profile/fleet/CreateFleet';
import ProfilePhotos from '../approved/main/profile/photos/ProfilePhotos';
import ProfileCompany from '../approved/main/profile/ProfileCompany';
import { AboutAutonomy } from './AboutAutonomy';
import { AboutBeAvailable } from './AboutBeAvailable';
import { AboutNoScore } from './AboutNoScore';
import { AboutTests } from './AboutTests';
import { AboutTransparency } from './AboutTransparency';
import ProfilePending from './ProfilePending';
import ProfileSubmitted from './ProfileSubmitted';
import { UnapprovedParamList } from './types';

const Stack = createStackNavigator<UnapprovedParamList>();
export default function () {
  const courier = useSelector(getCourier)!;
  const { onboarded, situation } = courier;
  let initialRouteName: 'ProfilePending' | 'CourierOnboarding' | 'ProfileSubmitted' | undefined =
    undefined;
  if (situation === 'pending' && onboarded) initialRouteName = 'ProfilePending';
  else if (situation === 'submitted' || situation === 'invalid' || situation === 'verified')
    initialRouteName = 'ProfileSubmitted';
  else initialRouteName = 'CourierOnboarding';
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
      <Stack.Screen
        name="CourierOnboarding"
        component={Onboarding}
        options={{ title: t('Boas vindas ao AppJusto'), headerLeft: () => null }}
      />
      <Stack.Screen
        name="ProfilePending"
        component={ProfilePending}
        options={{ headerShown: false }}
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
      <Stack.Screen
        name="ProfileSubmitted"
        component={ProfileSubmitted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AboutTests"
        component={AboutTests}
        options={{ title: t('Sobre o período de testes') }}
      />
      <Stack.Screen
        name="AboutAutonomy"
        component={AboutAutonomy}
        options={{ title: t('Autonomia e preço justo') }}
      />
      <Stack.Screen
        name="AboutTransparency"
        component={AboutTransparency}
        options={{ title: t('Transparência') }}
      />
      <Stack.Screen
        name="AboutNoScore"
        component={AboutNoScore}
        options={{ title: t('Sem bloqueios automáticos') }}
      />
      <Stack.Screen
        name="AboutBeAvailable"
        component={AboutBeAvailable}
        options={{ title: t('Fique disponível para corridas') }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{ title: t('Sobre o AppJusto') }}
      />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={{ headerShown: true, title: t('Cancelar cadastro') }}
      />
      <Stack.Screen
        name="PermissionDenied"
        component={PermissionDenied}
        options={{ title: t('Compartilhar sua localização') }}
      />
    </Stack.Navigator>
  );
}
