import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../common/app/context';
import { UnloggedParamList } from '../../../../common/screens/unlogged/types';
import { useGeosearch } from '../../../../common/store/api/business/geosearch/useGeosearch';
import { useLastRestaurants } from '../../../../common/store/api/order/hooks/useLastRestaurants';
import { useSegmentScreen } from '../../../../common/store/api/track';
import {
  updateCurrentLocation,
  updateCurrentPlace,
} from '../../../../common/store/consumer/actions';
import { getConsumer, getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { SearchFilter } from '../../../../common/store/consumer/types';
import { colors, padding } from '../../../../common/styles';
import { LoggedNavigatorParamList } from '../../types';
import { RestaurantList } from '../restaurant/list/RestaurantList';
import { sectionsFromGeosearch } from '../restaurant/list/sectionsFromGeosearch';
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
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const currentLocation = useSelector(getCurrentLocation);
  const consumer = useSelector(getConsumer);
  // state
  const [filters, setFilters] = React.useState<SearchFilter[]>([]);
  // const {
  //   results: restaurants,
  //   isLoading,
  //   refetch,
  //   fetchNextPage,
  // } = useSearch<BusinessAlgolia>(true, 'restaurant', 'distance', filters, currentLocation, '');
  const [refreshing, setRefreshing] = React.useState(false);
  const mostRecentRestaurants = useLastRestaurants(consumer?.id);
  const { loading, available, unavailable, refetch, fetchNextPage } = useGeosearch();
  // console.log('>>> AVAILABLE:', available);
  // console.log('>>> UNAVAILABLE:', unavailable);
  // side effects
  React.useEffect(() => {
    if (place) {
      dispatch(updateCurrentLocation(undefined));
      // console.log('FoodOrderHome: chamando updateCurrentLocation(undefined)');
      dispatch(updateCurrentPlace(place));
    }
  }, [dispatch, place]);
  // tracking
  useSegmentScreen('FoodOrderHome');
  // handlers
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  // UI
  return (
    <RestaurantList
      sections={sectionsFromGeosearch(available, unavailable)}
      onEndReached={() => {
        fetchNextPage();
      }}
      onEndReachedThreshold={0.7}
      ListHeaderComponent={
        <View style={{ backgroundColor: colors.white, paddingBottom: padding }}>
          <FoodOrderHomeHeader
            onSelectRestaurant={(restaurantId) => {
              navigation.push('RestaurantNavigator', {
                restaurantId,
                screen: 'RestaurantDetail',
              });
            }}
            selectedCuisineId={filters.find(() => true)?.value}
            onChangePlace={() => {
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
            consumer={consumer}
            onLogin={() => {
              navigation.replace('WelcomeScreen');
            }}
            recentRestaurants={mostRecentRestaurants}
          />
        </View>
      }
      onSelect={(restaurantId) => {
        navigation.push('RestaurantNavigator', {
          restaurantId,
          screen: 'RestaurantDetail',
        });
      }}
      loading={loading}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      onRecommend={() => {
        navigation.navigate('RecommendRestaurant');
      }}
    />
  );
};
