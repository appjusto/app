import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../strings';
import BackButton from '../common/buttons/BackButton';
import Terms from '../unlogged/Terms';
import Profile from './Profile';
import ProfileCards from './ProfileCards';
import ProfileEdit from './ProfileEdit';
import ProfileErase from './ProfileErase';
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
        name="ProfileCards"
        component={ProfileCards}
        options={({ navigation }) => ({
          title: t('Formas de pagamento'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
