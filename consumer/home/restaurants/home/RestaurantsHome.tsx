import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BusinessAlgolia } from 'appjusto-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../common/app/context';
import { useSearch } from '../../../../common/store/api/search/useSearch';
import {
  updateCurrentLocation,
  updateCurrentPlace,
} from '../../../../common/store/consumer/actions';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { SearchFilter } from '../../../../common/store/consumer/types';
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
  const [filters, setFilters] = React.useState<SearchFilter[]>([]);
  const { results: restaurants, isLoading, fetchNextPage } = useSearch<BusinessAlgolia>(
    true,
    'restaurant',
    'distance',
    filters,
    currentLocation,
    ''
  );
  // side effects
  React.useEffect(() => {
    if (place) {
      dispatch(updateCurrentLocation(undefined));
      dispatch(updateCurrentPlace(place));
    }
  }, [dispatch, place]);
  // UI
  return (
    <RestaurantList
      items={restaurants}
      ListHeaderComponent={
        <RestaurantsHomeHeader
          isLoading={isLoading}
          selectedCuisineId={filters.find(() => true)?.value}
          onLocationPress={() => {
            navigation.navigate('AddressComplete', {
              returnParam: 'place',
              returnScreen: 'RestaurantsHome',
            });
          }}
          onSearchPress={() => {
            navigation.navigate('RestaurantSearch');
          }}
          onCuisineSelect={(cuisine) => {
            setFilters(cuisine ? [{ type: 'cuisine', value: cuisine.name }] : []);
          }}
        />
      }
      onSelect={(restaurantId) => {
        navigation.push('RestaurantNavigator', {
          restaurantId,
          screen: 'RestaurantDetail',
        });
      }}
      onEndReached={() => fetchNextPage()}
    />
  );
}
