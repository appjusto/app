import { Place } from 'appjusto-types';
import { NestedNavigatorParams } from '../../../common/types';
import { RestaurantNavigatorParamList } from '../../home/restaurants/restaurant/types';
import { AddressCompleteParamList } from '../common/AddressComplete';

export type FoodOrderNavigatorParamList = {
  FoodOrderHome?: {
    place?: Place;
  };
  RestaurantSearch: undefined;
  RestaurantNavigator: {
    restaurantId: string;
  } & NestedNavigatorParams<RestaurantNavigatorParamList>;
  FilterScreen: undefined;
} & AddressCompleteParamList;
