import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import BackButton from '../../common/buttons/BackButton';
import ProfileBank from '../../profile/ProfileBank';
import ProfileEdit from '../../profile/ProfileEdit';
import SelectBank from '../../profile/SelectBank';
import FleeNavigator from '../../profile/fleet/FleetNavigator';
import ProfilePhotos from '../../profile/photos/ProfilePhotos';
import PendingChecklist from './PendingChecklist';
import ProfileFeedback from './ProfileFeedback';
import { PendingParamList } from './types';
import FleetNavigator from '../../profile/fleet/FleetNavigator';

const Stack = createStackNavigator<PendingParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PendingChecklist"
        component={PendingChecklist}
        options={{ title: t('Novo cadastro') }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={({ navigation }) => ({
          title: t('Seus dados'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfilePhotos"
        component={ProfilePhotos}
        options={({ navigation }) => ({
          title: t('Fotos e documentos'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfileBank"
        component={ProfileBank}
        options={({ navigation }) => ({
          title: t('Dados bancários'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="SelectBank"
        component={SelectBank}
        options={({ navigation }) => ({
          title: t('Nome do seu banco'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="FleetStack"
        component={FleetNavigator}
        options={({ navigation }) => ({
          title: t('Escolha sua frota'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfileFeedback"
        component={ProfileFeedback}
        options={({ navigation }) => ({
          title: t('Novo cadastro'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
