import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../common/components/views/ArrowBox';
import ProfileEdit from '../../consumer/profile/ProfileEdit';
import { t } from '../../strings';
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
        options={{ title: t('Novo cadastro') }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Seus dados') }}
      />
      <Stack.Screen
        name="ProfilePhotos"
        component={ProfilePhotos}
        options={{ title: t('Fotos e documentos') }}
      />
      <Stack.Screen
        name="Bank"
        component={BankNavigator}
        options={{ title: t('Dados bancários') }}
      />
      <Stack.Screen
        name="Fleet"
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
