import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../../common/components/buttons/BackButton';
import ProfileEdit from '../../../common/screens/profile/ProfileEdit';
import ProfileErase from '../../../common/screens/profile/ProfileErase';
import Terms from '../../../common/screens/unlogged/Terms';
import { t } from '../../../strings';
import Profile from './Profile';
import BankNavigator from './bank/BankNavigator';
import { ProfileParamList } from './types';

const Stack = createStackNavigator<ProfileParamList>();
export default function () {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          title: t('Sua conta'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={({ navigation }) => ({
          title: t('Sua conta'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={({ navigation }) => ({
          title: t('Fique por dentro'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={({ navigation }) => ({
          title: t('Excluir minha conta'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="Bank"
        component={BankNavigator}
        options={{
          title: t('Dados bancários'),
        }}
      />
    </Stack.Navigator>
  );
}
