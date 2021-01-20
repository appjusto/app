import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchRestaurants } from '../../../../common/store/api/search/useSearchRestaurants';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import RestaurantList from '../search/RestaurantList';
import { RestaurantsNavigatorParamList } from '../types';
import RestaurantsHomeHeader from './RestaurantsHomeHeader';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'RestaurantsHome'>;
type ScreenRouteProp = RouteProp<RestaurantsNavigatorParamList, 'RestaurantsHome'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  // redux store
  const currentLocation = useSelector(getCurrentLocation);
  // state
  const { restaurants } = useSearchRestaurants(currentLocation, '');

  // UI
  return (
    <RestaurantList
      items={restaurants}
      ListHeaderComponent={
        <RestaurantsHomeHeader
          onLocationPress={() => {
            navigation.navigate('AddressComplete', {
              returnParam: 'address',
              returnScreen: 'RestaurantsHome',
            });
          }}
          onSearchPress={() => {
            navigation.navigate('RestaurantSearch');
          }}
        />
      }
      onSelect={(restaurantId) => {
        navigation.push('RestaurantNavigator', {
          restaurantId,
        });
      }}
    />
  );
}
