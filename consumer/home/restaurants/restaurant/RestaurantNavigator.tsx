import { RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ArrowBox from '../../../../common/components/views/ArrowBox';
import { t } from '../../../../strings';
import { RestaurantsNavigatorParamList } from '../types';
import AboutRestaurant from './AboutRestaurant';
import ItemDetail from './ItemDetail';
import RestaurantDetail from './RestaurantDetail';
import { RestaurantNavigatorParamList } from './types';

const Stack = createStackNavigator<RestaurantNavigatorParamList>();

type ScreenRouteProp = RouteProp<RestaurantsNavigatorParamList, 'RestaurantNavigator'>;

type Props = {
  route: ScreenRouteProp;
};

export default function ({ route }: Props) {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetail}
        options={{ title: t('Saber mais') }}
      />
      <Stack.Screen
        name="AboutRestaurant"
        component={AboutRestaurant}
        options={{ title: t('Saber mais') }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{ title: t('Detalhes do item') }}
      />
    </Stack.Navigator>
  );
}
