import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { PermissionDenied } from '../../common/screens/PermissionDenied';
import { defaultScreenOptions } from '../../common/screens/options';
import { AboutApp } from '../../common/screens/profile/AboutApp';
import { CommonProfileEdit } from '../../common/screens/profile/CommonProfileEdit';
import { PhoneVerificationScreen } from '../../common/screens/profile/PhoneVerificationScreen';
import ProfileErase from '../../common/screens/profile/ProfileErase';
import { Onboarding } from '../../common/screens/unlogged/onboarding/Onboarding';
import { getCourier } from '../../common/store/courier/selectors';
import { t } from '../../strings';
import { ApprovalProcess } from '../approved/main/howitworks/approval/ApprovalProcess';
import { BlockProcess } from '../approved/main/howitworks/blocks/BlockProcess';
import { FleetProcess } from '../approved/main/howitworks/fleets/FleetProcess';
import { RevenueProcess } from '../approved/main/howitworks/revenue/RevenueProcess';
import ProfileCompany from '../approved/main/profile/ProfileCompany';
import ProfileBank from '../approved/main/profile/bank/ProfileBank';
import SelectBank from '../approved/main/profile/bank/SelectBank';
import ProfilePhotos from '../approved/main/profile/photos/ProfilePhotos';
import ProfilePending from './ProfilePending';
import { ProfileSubmitted } from './submitted/ProfileSubmitted';
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
      {/* pending */}
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
        name="PhoneVerificationScreen"
        component={PhoneVerificationScreen}
        options={{ title: t('Verificação de telefone') }}
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
        name="ProfileErase"
        component={ProfileErase}
        options={{ headerShown: true, title: t('Cancelar cadastro') }}
      />
      {/* submitted */}
      <Stack.Screen
        name="ProfileSubmitted"
        component={ProfileSubmitted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApprovalProcess"
        component={ApprovalProcess}
        options={{ title: t('Aprovação de cadastro') }}
      />
      <Stack.Screen
        name="RevenueProcess"
        component={RevenueProcess}
        options={{ title: t('Recebimento') }}
      />
      <Stack.Screen name="FleetProcess" component={FleetProcess} options={{ title: t('Frotas') }} />
      <Stack.Screen
        name="BlockProcess"
        component={BlockProcess}
        options={{ title: t('Bloqueios') }}
      />
      {/* approved */}
      <Stack.Screen
        name="CourierOnboarding"
        component={Onboarding}
        options={{ title: t('Boas vindas ao AppJusto'), headerLeft: () => null }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{ title: t('Sobre o AppJusto') }}
      />
      <Stack.Screen
        name="PermissionDenied"
        component={PermissionDenied}
        options={{ title: t('Compartilhar sua localização') }}
      />
    </Stack.Navigator>
  );
}
