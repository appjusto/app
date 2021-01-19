import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../../common/components/views/ArrowBox';
import { BusinessProvider } from '../../../common/store/context/business';
import { t } from '../../../strings';
import AddressComplete from '../orders/AddressComplete';
import RestaurantsHome from './home/RestaurantsHome';
import OrderBy from './OrderBy';
import RestaurantNavigator from './restaurant/RestaurantNavigator';
import RestaurantSearch from './search/RestaurantSearch';
import { RestaurantsNavigatorParamList } from './types';

const Stack = createStackNavigator<RestaurantsNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
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
            <RestaurantNavigator {...props} />
          </BusinessProvider>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="RestaurantSearch"
        component={RestaurantSearch}
        options={{ title: t('Buscar') }}
      />
      <Stack.Screen
        name="OrderBy"
        component={OrderBy}
        options={{ title: t('Filtrar resultados') }}
      />
    </Stack.Navigator>
  );
}
