import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../common/components/buttons/BackButton';
import ProfileBank from '../../common/screens/profile/ProfileBank';
import ProfileEdit from '../../common/screens/profile/ProfileEdit';
import SelectBank from '../../common/screens/profile/SelectBank';
import FleetNavigator from '../../common/screens/profile/fleet/FleetNavigator';
import ProfilePhotos from '../../common/screens/profile/photos/ProfilePhotos';
import Camera from '../../profile/photos/Camera';
import { t } from '../../strings';
import PendingChecklist from './PendingChecklist';
import ProfileFeedback from './ProfileFeedback';
import { PendingParamList } from './types';

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
        name="Camera"
        component={Camera}
        options={({ navigation }) => ({
          title: t('Câmera'),
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
          title: t('Selecione seu banco'),
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
