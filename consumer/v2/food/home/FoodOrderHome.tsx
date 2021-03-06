import { BusinessAlgolia } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { useSearch } from '../../../../common/store/api/search/useSearch';
import {
  updateCurrentLocation,
  updateCurrentPlace,
} from '../../../../common/store/consumer/actions';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { SearchFilter } from '../../../../common/store/consumer/types';
import { LoggedNavigatorParamList } from '../../types';
import { sectionsFromResults } from '../restaurant/list';
import { RestaurantList } from '../restaurant/list/RestaurantList';
import { FoodOrderNavigatorParamList } from '../types';
import { FoodOrderHomeHeader } from './FoodOrderHomeHeader';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList, 'FoodOrderHome'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<FoodOrderNavigatorParamList, 'FoodOrderHome'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export const FoodOrderHome = ({ route, navigation }: Props) => {
  // params
  const { place } = route.params ?? {};
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const currentLocation = useSelector(getCurrentLocation);
  // state
  const [filters, setFilters] = React.useState<SearchFilter[]>([]);
  const {
    results: restaurants,
    isLoading,
    refetch,
    fetchNextPage,
  } = useSearch<BusinessAlgolia>(true, 'restaurant', 'distance', filters, currentLocation, '');
  const [refreshing, setRefreshing] = React.useState(false);
  // side effects
  React.useEffect(() => {
    if (place) {
      dispatch(updateCurrentLocation(undefined));
      dispatch(updateCurrentPlace(place));
    }
  }, [dispatch, place]);
  // handlers
  const refresh = async () => {
    setRefreshing(true);
    await api.search().clearCache();
    await refetch();
    setRefreshing(false);
  };
  // UI
  return (
    <RestaurantList
      sections={sectionsFromResults(restaurants)}
      ListHeaderComponent={
        <FoodOrderHomeHeader
          selectedCuisineId={filters.find(() => true)?.value}
          onLocationPress={() => {
            navigation.navigate('AddressComplete', {
              returnParam: 'place',
              returnScreen: 'FoodOrderHome',
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
      loading={isLoading}
      refreshing={refreshing}
      onRefresh={() => refresh()}
    />
  );
};
