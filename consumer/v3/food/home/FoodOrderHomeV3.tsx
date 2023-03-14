import { BusinessAlgolia } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { UnloggedParamList } from '../../../../common/screens/unlogged/types';
import { useLastRestaurants } from '../../../../common/store/api/order/hooks/useLastRestaurants';
import { useSearch } from '../../../../common/store/api/search/useSearch';
import { useSegmentScreen } from '../../../../common/store/api/track';
import {
  updateCurrentLocation,
  updateCurrentPlace,
} from '../../../../common/store/consumer/actions';
import { getConsumer, getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { SearchFilter } from '../../../../common/store/consumer/types';
import { colors, padding } from '../../../../common/styles';
import { FoodOrderHomeHeader } from '../../../v2/food/home/FoodOrderHomeHeader';
import { sectionsFromResults } from '../../../v2/food/restaurant/list';
import { RestaurantList } from '../../../v2/food/restaurant/list/RestaurantList';
import { FoodOrderNavigatorParamList } from '../../../v2/food/types';
import { LoggedNavigatorParamList } from '../../../v2/types';
import { FoodOrderHomeHeaderV3 } from './header/FoodOrderHomeHeaderV3';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList, 'FoodOrderHome'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
>;
type ScreenRouteProp = RouteProp<FoodOrderNavigatorParamList, 'FoodOrderHome'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export const FoodOrderHomeV3 = ({ route, navigation }: Props) => {
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
    fetchNextPage,
  } = useSearch<BusinessAlgolia>(true, 'restaurant', 'distance', filters, currentLocation, '');
  const [refreshing, setRefreshing] = React.useState(false);
  const mostRecentRestaurants = useLastRestaurants(consumer?.id);
  // side effects
  React.useEffect(() => {
    if (place) {
      dispatch(updateCurrentLocation(undefined));
      // console.log('FoodOrderHome: chamando updateCurrentLocation(undefined)');
      dispatch(updateCurrentPlace(place));
    }
  }, [dispatch, place]);
  // tracking
  useSegmentScreen('FoodOrderHomeV3');
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
      sections={sectionsFromResults(restaurants, currentLocation)}
      onEndReached={() => {
        fetchNextPage();
      }}
      onEndReachedThreshold={0.7}
      ListHeaderComponent={
        <View style={{ backgroundColor: colors.white, paddingBottom: padding }}>
          <FoodOrderHomeHeaderV3
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
            onSelectBusiness={(restaurantId) => {
              navigation.push('RestaurantNavigator', {
                restaurantId,
                screen: 'RestaurantDetail',
              });
            }}
            onCuisineSelect={(cuisine) => {
              setFilters(cuisine ? [{ type: 'cuisine', value: cuisine.name }] : []);
            }}
          />
          <FoodOrderHomeHeader
            onSelectRestaurant={(restaurantId) => {
              navigation.push('RestaurantNavigator', {
                restaurantId,
                screen: 'RestaurantDetail',
              });
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
      loading={isLoading}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      onRecommend={() => {
        navigation.navigate('RecommendRestaurant');
      }}
    />
  );
};
