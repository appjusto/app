import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import FleetDetail from '../../common/screens/fleet/FleetDetail';
import { defaultScreenOptions } from '../../common/screens/options';
import { PermissionDenied } from '../../common/screens/PermissionDenied';
import ProfileErase from '../../common/screens/profile/ProfileErase';
import { Onboarding } from '../../common/screens/unlogged/Onboarding';
import { getCourier } from '../../common/store/courier/selectors';
import { t } from '../../strings';
import ProfileBank from '../approved/main/profile/bank/ProfileBank';
import SelectBank from '../approved/main/profile/bank/SelectBank';
import AllFleets from '../approved/main/profile/fleet/AllFleets';
import ChooseFleet from '../approved/main/profile/fleet/ChooseFleet';
import CreateFleet from '../approved/main/profile/fleet/CreateFleet';
import ProfilePhotos from '../approved/main/profile/photos/ProfilePhotos';
import ProfileCompany from '../approved/main/profile/ProfileCompany';
import ProfileEdit from '../approved/main/profile/ProfileEdit';
import ProfilePending from './ProfilePending';
import ProfileRejected from './ProfileRejected';
import ProfileSubmitted from './ProfileSubmitted';
import { UnapprovedParamList } from './types';

const Stack = createStackNavigator<UnapprovedParamList>();
export default function () {
  const courier = useSelector(getCourier)!;
  return (
    <Stack.Navigator
      screenOptions={defaultScreenOptions}
      initialRouteName={courier.onboarded ? 'ProfilePending' : 'CourierOnboarding'}
    >
      <Stack.Screen
        name="CourierOnboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePending"
        component={ProfilePending}
        options={{ headerShown: false }}
      />
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
        name="ProfileRejected"
        component={ProfileRejected}
        options={{ headerShown: false }}
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
