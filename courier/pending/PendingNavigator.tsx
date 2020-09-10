import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../common/components/buttons/BackButton';
import ProfileEdit from '../../common/screens/profile/ProfileEdit';
import { t } from '../../strings';
import BankNavigator from '../approved/profile/bank/BankNavigator';
import Camera from '../approved/profile/photos/Camera';
import ProfilePhotos from '../approved/profile/photos/ProfilePhotos';
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
        name="Bank"
        component={BankNavigator}
        options={({ navigation }) => ({
          title: t('Dados bancários'),
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
