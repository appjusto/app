import { BusinessAlgolia } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { UnloggedParamList } from '../../../../common/screens/unlogged/types';
import { useSearch } from '../../../../common/store/api/search/useSearch';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import {
  updateCurrentLocation,
  updateCurrentPlace,
} from '../../../../common/store/consumer/actions';
import { getConsumer, getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { SearchFilter } from '../../../../common/store/consumer/types';
import { colors, padding } from '../../../../common/styles';
import { LoggedNavigatorParamList } from '../../types';
import { sectionsFromResults } from '../restaurant/list';
import { RestaurantList } from '../restaurant/list/RestaurantList';
import { FoodOrderNavigatorParamList } from '../types';
import { FoodOrderHomeHeader } from './FoodOrderHomeHeader';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList, 'FoodOrderHome'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
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
  const consumer = useSelector(getConsumer);
  // state
  const [filters, setFilters] = React.useState<SearchFilter[]>([]);
  const {
    results: restaurants,
    isLoading,
    refetch,
  } = useSearch<BusinessAlgolia>(true, 'restaurant', 'distance', filters, currentLocation, '');
  const [refreshing, setRefreshing] = React.useState(false);
  // side effects
  React.useEffect(() => {
    if (place) {
      dispatch(updateCurrentLocation(undefined));
      dispatch(updateCurrentPlace(place));
    }
  }, [dispatch, place]);
  // tracking
  useSegmentScreen('FoodOrderHome');
  // handlers
  const refresh = async () => {
    setRefreshing(true);
    await api.search().clearCache();
    await refetch();
    track('refreshing restaurant list');
    setRefreshing(false);
  };
  // UI
  return (
    <RestaurantList
      sections={sectionsFromResults(restaurants)}
      ListHeaderComponent={
        <View style={{ backgroundColor: colors.white, paddingBottom: padding }}>
          <FoodOrderHomeHeader
            selectedCuisineId={filters.find(() => true)?.value}
            onLocationPress={() => {
              track('navigating to change location');
              navigation.navigate('AddressComplete', {
                returnParam: 'place',
                returnScreen: 'FoodOrderHome',
              });
            }}
            onSearchPress={() => {
              track('navigating to RestaurantSearch');
              navigation.navigate('RestaurantSearch');
            }}
            onCuisineSelect={(cuisine) => {
              setFilters(cuisine ? [{ type: 'cuisine', value: cuisine.name }] : []);
              track('filtering restaurant list by cuisine');
            }}
            consumer={consumer}
            onLogin={() => {
              track('navigating to login');
              navigation.replace('WelcomeScreen');
            }}
          />
        </View>
      }
      onSelect={(restaurantId) => {
        track('clicked on a restaurant');
        navigation.push('RestaurantNavigator', {
          restaurantId,
          screen: 'RestaurantDetail',
        });
      }}
      loading={isLoading}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      onRecommend={() => {
        track('navigating to RecommendRestaurant');
        navigation.navigate('RecommendRestaurant');
      }}
    />
  );
};
