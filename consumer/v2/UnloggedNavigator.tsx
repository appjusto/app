import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { OrderDetail } from '../../business/orders/screens/OrderDetail';
import { OrdersManager } from '../../business/orders/screens/OrdersManager';
import { defaultScreenOptions } from '../../common/screens/options';
import SignInFeedback from '../../common/screens/unlogged/SignInFeedback';
import Terms from '../../common/screens/unlogged/Terms';
import { UnloggedParamList } from '../../common/screens/unlogged/types';
import WelcomeScreen from '../../common/screens/unlogged/WelcomeScreen';
import { t } from '../../strings';
import { FoodOrderNavigator } from './food/FoodOrderNavigator';
import Home from './main/home/Home';

const Stack = createStackNavigator<UnloggedParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="FoodOrderNavigator"
        component={FoodOrderNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ title: t('Entrar no AppJusto') }}
      />
      <Stack.Screen
        name="SignInFeedback"
        component={SignInFeedback}
        options={{ title: t('Verifique seu e-mail') }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
      {/* test setup */}
      <Stack.Screen
        name="OrdersManager"
        component={OrdersManager}
        options={{ title: t('Gerenciador de pedidos') }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: t('Ver pedido') }}
      />
    </Stack.Navigator>
  );
}
