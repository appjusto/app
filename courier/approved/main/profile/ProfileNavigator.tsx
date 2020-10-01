import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../../../common/components/views/ArrowBox';
import ProfileErase from '../../../../common/screens/profile/ProfileErase';
import Terms from '../../../../common/screens/unlogged/Terms';
import { t } from '../../../../strings';
import Profile from './Profile';
import ProfileEdit from './ProfileEdit';
import BankNavigator from './bank/BankNavigator';
import FleetNavigator from './fleet/FleetNavigator';
import ProfilePhotos from './photos/ProfilePhotos';
import { CourierProfileParamList } from './types';

const Stack = createStackNavigator<CourierProfileParamList>();
export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Dados pessoais') }}
      />
      <Stack.Screen
        name="ProfilePhotos"
        component={ProfilePhotos}
        options={{
          title: t('Fotos & Documentos'),
        }}
      />
      <Stack.Screen name="Fleet" component={FleetNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Bank"
        component={BankNavigator}
        options={{
          title: t('Dados bancários'),
        }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
      <Stack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={{ title: t('Excluir minha conta') }}
      />
    </Stack.Navigator>
  );
}
