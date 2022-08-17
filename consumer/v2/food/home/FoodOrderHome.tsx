import { BusinessAlgolia } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { usePlatformAccess } from '../../../../common/hooks/usePlatformAccess';
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
import { colors, padding, screens } from '../../../../common/styles';
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
  const platformAccess = usePlatformAccess();
  const minVersion = platformAccess?.minVersions?.consumer;
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
  useSegmentScreen('FoodOrderHome');
  // handlers
  const refresh = async () => {
    setRefreshing(true);
    await api.search().clearCache();
    await refetch();
    setRefreshing(false);
  };
  // UI
  if (!minVersion) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <RestaurantList
      sections={sectionsFromResults(restaurants, currentLocation)}
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
      loading={isLoading}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      onRecommend={() => {
        navigation.navigate('RecommendRestaurant');
      }}
    />
  );
};
