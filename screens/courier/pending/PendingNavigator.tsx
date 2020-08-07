import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import BackButton from '../../common/buttons/BackButton';
import ProfileEdit from '../../profile/ProfileEdit';
import ProfilePhotos from '../../profile/photos/ProfilePhotos';
import PendingChecklist from './PendingChecklist';
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
    </Stack.Navigator>
  );
}
