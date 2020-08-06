import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import ProfileEdit from '../../profile/ProfileEdit';
import PendingChecklist from './PendingChecklist';
import { PendingParamList } from './types';
import BackButton from '../../common/buttons/BackButton';

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
    </Stack.Navigator>
  );
}
