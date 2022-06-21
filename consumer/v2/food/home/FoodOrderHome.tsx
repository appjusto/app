import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BusinessAlgolia } from '../../../../../types';
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
  const [cuisineName, setCuisineName] = React.useState<string>();
  // const [restaurants, setRestaurants] = React.useState<WithId<Business>[]>();
  const [refreshing, setRefreshing] = React.useState(false);
  const mostRecentRestaurants = useLastRestaurants(consumer?.id);
  const {
    results: restaurants,
    isLoading,
    refetch,
    fetchNextPage,
  } = useSearch<BusinessAlgolia>(
    true,
    'restaurant',
    'distance',
    cuisineName ? [{ type: 'cuisine', value: cuisineName }] : [],
    currentLocation,
    ''
  );
  // helpers
  // firestore search
  // const fetchRestaurants = (startAt: number = 0) => {
  //   if (!currentLocation) return;
  //   setRefreshing(true);
  //   api
  //     .businessesGeoSearch()
  //     .fetchBusinessesAround(currentLocation, startAt, cuisineName)
  //     .then((value) => {
  //       setRefreshing(false);
  //       setRestaurants(value);
  //     });
  // };
  // side effects
  // fetch restaurants according with currentLocation
  // firestore search
  // React.useEffect(() => {
  //   fetchRestaurants();
  // }, [currentLocation, cuisineName]);
  // updating current location when place changes
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
  const refresh = () => {
    setRefreshing(true);
    // fetchRestaurants();
    api.search().clearCache().then(null);
    refetch()?.then(null);
    setRefreshing(false);
  };
  // console.log('FOODORDERHOME CURRENTLOCATION', currentLocation);
  // UI
  return (
    <RestaurantList
      sections={sectionsFromResults(restaurants, currentLocation)}
      onEndReachedThreshold={0.7}
      // onEndReached={() => fetchRestaurants(restaurants?.length)}
      onEndReached={fetchNextPage}
      ListHeaderComponent={
        <View style={{ backgroundColor: colors.white, paddingBottom: padding }}>
          <FoodOrderHomeHeader
            recentRestaurants={mostRecentRestaurants}
            consumer={consumer}
            selectedCuisineId={cuisineName}
            onSelectRestaurant={(restaurantId) => {
              navigation.push('RestaurantNavigator', {
                restaurantId,
                screen: 'RestaurantDetail',
              });
            }}
            onCuisineSelect={(cuisine) => setCuisineName(cuisine?.name)}
            onChangePlace={() => {
              navigation.navigate('AddressComplete', {
                returnParam: 'place',
                returnScreen: 'FoodOrderHome',
              });
            }}
            onSearchPress={() => {
              navigation.navigate('RestaurantSearch');
            }}
            onLogin={() => {
              navigation.replace('WelcomeScreen');
            }}
          />
        </View>
      }
      onSelect={(restaurantId) => {
        navigation.push('RestaurantNavigator', {
          restaurantId,
          screen: 'RestaurantDetail',
        });
      }}
      // loading={restaurants === undefined}
      loading={isLoading}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      onRecommend={() => {
        navigation.navigate('RecommendRestaurant');
      }}
    />
  );
};
