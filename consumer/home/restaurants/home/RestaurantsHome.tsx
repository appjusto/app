import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../common/app/context';
import { useSearchRestaurants } from '../../../../common/store/api/search/useSearchRestaurants';
import {
  updateCurrentLocation,
  updateCurrentPlace,
} from '../../../../common/store/consumer/actions';
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
  // params
  const { place } = route.params ?? {};
  // context
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const currentLocation = useSelector(getCurrentLocation);
  // state
  const { restaurants, isLoading, fetchNextPage } = useSearchRestaurants(currentLocation, '');
  // side effects
  React.useEffect(() => {
    if (place) {
      dispatch(updateCurrentLocation(undefined));
      dispatch(updateCurrentPlace(place));
    }
  }, [place]);
  // UI
  return (
    <RestaurantList
      items={restaurants}
      ListHeaderComponent={
        <RestaurantsHomeHeader
          isLoading={isLoading}
          onLocationPress={() => {
            navigation.navigate('AddressComplete', {
              returnParam: 'place',
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
      onEndReached={() => fetchNextPage()}
    />
  );
}
