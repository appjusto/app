import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BackButton from '../../common/components/buttons/BackButton';
import { t } from '../../strings';
import MainNavigator from './MainNavigator';
import Matching from './matching/Matching';
import MatchingFeedback from './matching/MatchingFeedback';
import { ApprovedParamList } from './types';

const Stack = createStackNavigator<ApprovedParamList>();
export default function () {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Matching"
        component={Matching}
        options={({ navigation }) => ({
          title: t('Nova corrida'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name="MatchingFeedback"
        component={MatchingFeedback}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
