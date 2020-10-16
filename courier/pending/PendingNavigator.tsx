import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../common/components/views/ArrowBox';
import { t } from '../../strings';
import ProfileCompany from '../approved/main/profile/ProfileCompany';
import ProfileEdit from '../approved/main/profile/ProfileEdit';
import BankNavigator from '../approved/main/profile/bank/BankNavigator';
import FleetNavigator from '../approved/main/profile/fleet/FleetNavigator';
import ProfilePhotos from '../approved/main/profile/photos/ProfilePhotos';
import PendingChecklist from './PendingChecklist';
import ProfileFeedback from './ProfileFeedback';
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
        name="PendingChecklist"
        component={PendingChecklist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Seus dados') }}
      />
      <Stack.Screen
        name="ProfileCompany"
        component={ProfileCompany}
        options={{ title: t('Dados da empresa') }}
      />
      <Stack.Screen
        name="ProfilePhotos"
        component={ProfilePhotos}
        options={{ title: t('Fotos e documentos') }}
      />
      <Stack.Screen
        name="BankNavigator"
        component={BankNavigator}
        options={{ title: t('Dados bancários') }}
      />
      <Stack.Screen
        name="FleetNavigator"
        component={FleetNavigator}
        options={{ title: t('Escolha sua frota'), headerShown: false }}
      />
      <Stack.Screen
        name="ProfileFeedback"
        component={ProfileFeedback}
        options={{ title: t('Novo cadastro') }}
      />
    </Stack.Navigator>
  );
}
