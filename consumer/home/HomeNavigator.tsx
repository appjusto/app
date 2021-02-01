import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../common/components/views/ArrowBox';
import PermissionDeniedFeedback from '../../common/screens/PermissionDeniedFeedback';
import { t } from '../../strings';
import Home from './Home';
import { OrderNavigator } from './orders/common/OrderNavigator';
import OngoingOrder from './orders/OngoingOrder';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import RestaurantsNavigator from './restaurants/RestaurantsNavigator';
import { HomeNavigatorParamList } from './types';

const Stack = createStackNavigator<HomeNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateOrderP2P"
        component={CreateOrderP2P}
        options={{ title: t('Novo pedido') }}
      />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={{ title: t('Pedido em andamento') }}
      />
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderNavigator"
        component={OrderNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RestaurantsNavigator"
        component={RestaurantsNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
