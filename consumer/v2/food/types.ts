import { Place } from '@appjusto/types';
import { NestedNavigatorParams } from '../../../common/types';
import { AddressCompleteParamList } from '../common/AddressComplete';
import { RestaurantNavigatorParamList } from './restaurant/types';

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
