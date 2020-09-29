import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../common/components/views/ArrowBox';
import Chat from '../../common/screens/Chat';
import { t } from '../../strings';
import MainNavigator from './MainNavigator';
import Matching from './matching/Matching';
import MatchingFeedback from './matching/MatchingFeedback';
import OngoingDelivery from './matching/OngoingDelivery';
import OrderCompleted from './matching/OrderCompleted';
import { ApprovedParamList } from './types';

const Stack = createStackNavigator<ApprovedParamList>();
export default function () {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Matching" component={Matching} options={{ headerShown: false }} />
      <Stack.Screen
        name="OngoingDelivery"
        component={OngoingDelivery}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Conversa') }} />
      <Stack.Screen
        name="OrderCompleted"
        component={OrderCompleted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchingFeedback"
        component={MatchingFeedback}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
