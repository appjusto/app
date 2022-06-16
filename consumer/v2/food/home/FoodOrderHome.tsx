import { Business, WithId } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { UnloggedParamList } from '../../../../common/screens/unlogged/types';
import { useLastRestaurants } from '../../../../common/store/api/order/hooks/useLastRestaurants';
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
  const [restaurants, setRestaurants] = React.useState<WithId<Business>[]>();
  const [refreshing, setRefreshing] = React.useState(false);
  const mostRecentRestaurants = useLastRestaurants(consumer?.id);
  // helpers
  const fetchRestaurants = () => {
    if (!currentLocation) return;
    api
      .businessesGeoSearch()
      .fetchBusinessesAround(currentLocation, restaurants?.length, cuisineName)
      .then(setRestaurants);
  };
  // side effects
  // fetch restaurants according with currentLocation
  React.useEffect(() => {
    fetchRestaurants();
  }, [currentLocation, cuisineName]);
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
    fetchRestaurants();
    setRefreshing(false);
  };
  // console.log('FOODORDERHOME CURRENTLOCATION', currentLocation);
  // UI
  return (
    <RestaurantList
      sections={sectionsFromResults(restaurants, currentLocation)}
      onEndReachedThreshold={0.7}
      onEndReached={fetchRestaurants}
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
      loading={restaurants === undefined}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      onRecommend={() => {
        navigation.navigate('RecommendRestaurant');
      }}
    />
  );
};
