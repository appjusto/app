import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../../strings';
import BackButton from '../../../common/buttons/BackButton';
import Home from './Home';
import PermissionDeniedFeedback from './PermissionDeniedFeedback';
import Matching from './matching/Matching';
import { HomeParamList } from './types';

const Stack = createStackNavigator<HomeParamList>();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false, title: '' }} />
      <Stack.Screen
        name="Matching"
        component={Matching}
        options={({ navigation }) => ({
          title: t('Nova corrida'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen name="PermissionDeniedFeedback" component={PermissionDeniedFeedback} />
    </Stack.Navigator>
  );
}
