import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../common/components/views/ArrowBox';
import { t } from '../../strings';
import BankNavigator from '../approved/main/profile/bank/BankNavigator';
import FleetNavigator from '../approved/main/profile/fleet/FleetNavigator';
import ProfilePhotos from '../approved/main/profile/photos/ProfilePhotos';
import ProfileCompany from '../approved/main/profile/ProfileCompany';
import ProfileEdit from '../approved/main/profile/ProfileEdit';
import ProfilePending from './ProfilePending';
import ProfileRejected from './ProfileRejected';
import ProfileSubmitted from './ProfileSubmitted';
import { PendingParamList } from './types';

const Stack = createStackNavigator<PendingParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
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
        name="BankNavigator"
        component={BankNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FleetNavigator"
        component={FleetNavigator}
        options={{ headerShown: false }}
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
    </Stack.Navigator>
  );
}
