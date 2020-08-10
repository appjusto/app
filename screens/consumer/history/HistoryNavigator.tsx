import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { t } from '../../../strings';
import BackButton from '../../common/buttons/BackButton';
import ConsumerHistory from './ConsumerHistory';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConsumerHistory"
        component={ConsumerHistory}
        options={({ navigation }) => ({
          title: t('Histórico de pedidos'),
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}
