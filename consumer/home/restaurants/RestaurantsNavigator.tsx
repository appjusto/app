import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../common/screens/options';
import { BusinessProvider } from '../../../common/store/context/business';
import { t } from '../../../strings';
import AddressComplete from '../orders/AddressComplete';
import FilterScreen from './filter/FilterScreen';
import RestaurantsHome from './home/RestaurantsHome';
import RestaurantNavigator from './restaurant/RestaurantNavigator';
import RestaurantSearch from './search/RestaurantSearch';
import { RestaurantsNavigatorParamList } from './types';

const Stack = createStackNavigator<RestaurantsNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="RestaurantsHome"
        component={RestaurantsHome}
        options={{ title: t('Restaurantes e alimentação') }}
      />
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        // options={{ title: t('Restaurantes e alimentação') }}
      />
      <Stack.Screen name="RestaurantNavigator" options={{ headerShown: false }}>
        {(props) => (
          <BusinessProvider businessId={props.route.params.restaurantId}>
            <RestaurantNavigator />
          </BusinessProvider>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="RestaurantSearch"
        component={RestaurantSearch}
        options={{ title: t('Buscar') }}
      />
      <Stack.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{ title: t('Filtrar resultados') }}
      />
    </Stack.Navigator>
  );
}
