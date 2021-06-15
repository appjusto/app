import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { t } from '../../../../strings';
import { DeliveryProblemFeedback } from '../DeliveryProblemFeedback';

// DELETE THIS AFTER TESTING

const Stack = createStackNavigator(); // create the right param list and add its type here

export const DeliveryProblemNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DeliveryProblemFeedback"
        component={DeliveryProblemFeedback}
        options={{ title: t('Tive um problema'), headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
};
