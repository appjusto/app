import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import useLastKnownLocation from '../../../../common/hooks/useLastKnownLocation';
import { updateCurrentAddress } from '../../../../common/store/consumer/actions';
import { getCurrentAddress } from '../../../../common/store/consumer/selectors';
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
  const { address } = route.params ?? {};
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const currentAddress = useSelector(getCurrentAddress);
  // state
  const [restaurants, setRestaurants] = React.useState<WithId<Business>[]>();
  const { coords } = useLastKnownLocation();
  // whenever address changes (from AddressComplete)
  React.useEffect(() => {
    if (address) {
      dispatch(updateCurrentAddress(address.description));
    }
  }, [address]);
  React.useEffect(() => {
    if (!coords) return;
    (async () => {
      setRestaurants(await api.search().searchRestaurants(coords));
      // console.log(results);
    })();
  }, [coords]);

  // UI
  return (
    <RestaurantList
      items={restaurants}
      ListHeaderComponent={
        <RestaurantsHomeHeader
          onLocationPress={() => {
            navigation.navigate('AddressComplete', {
              value: currentAddress!,
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
