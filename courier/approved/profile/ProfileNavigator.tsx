import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../../common/components/buttons/BackButton';
import ProfileEdit from '../../../common/screens/profile/ProfileEdit';
import ProfileErase from '../../../common/screens/profile/ProfileErase';
import Terms from '../../../common/screens/unlogged/Terms';
import { ProfileParamList } from '../../../consumer/profile/types';
import ProfileBank from '../../../courier/approved/profile/bank/ProfileBank';
import SelectBank from '../../../courier/approved/profile/bank/SelectBank';
import { t } from '../../../strings';
import Profile from './Profile';

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
    </Stack.Navigator>
  );
}
