import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { defaultScreenOptions } from '../../../common/screens/options';
import { BusinessProvider } from '../../../common/store/context/business';
import { t } from '../../../strings';
import { AddressComplete } from '../common/AddressComplete';
import { FoodOrderHome } from './home/FoodOrderHome';
import { RecommendationFeedback } from './restaurant/recommend/RecommendationFeedback';
import { RecommendRestaurant } from './restaurant/recommend/RecommendRestaurant';
import RestaurantNavigator from './restaurant/RestaurantNavigator';
import { FilterScreen } from './search/filter/FilterScreen';
import RestaurantSearch from './search/RestaurantSearch';
import { FoodOrderNavigatorParamList } from './types';

const Stack = createStackNavigator<FoodOrderNavigatorParamList>();
export const FoodOrderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="FoodOrderHome"
        component={FoodOrderHome}
        options={{ title: t('Restaurantes') }}
      />
      <Stack.Screen
        name="RecommendRestaurant"
        component={RecommendRestaurant}
        options={{ title: t('Indicar restaurante') }}
      />
      <Stack.Screen
        name="RecommendationFeedback"
        component={RecommendationFeedback}
        options={{ title: t('Confirmação da indicação') }}
      />
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        options={{ title: t('Indicar restaurante') }}
      />
      <Stack.Screen
        name="RestaurantSearch"
        component={RestaurantSearch}
        options={{ title: t('Buscar') }}
      />
      <Stack.Screen name="RestaurantNavigator" options={{ headerShown: false }}>
        {(props) => (
          <BusinessProvider
            businessId={props.route.params.restaurantId}
            orderId={props.route.params.orderId}
          >
            <RestaurantNavigator />
          </BusinessProvider>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{ title: t('Filtrar resultados') }}
      />
    </Stack.Navigator>
  );
};
