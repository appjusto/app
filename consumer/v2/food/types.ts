import { Place } from 'appjusto-types';
import { NestedNavigatorParams } from '../../../common/types';
import { RestaurantNavigatorParamList } from '../../home/restaurants/restaurant/types';

export type FoodOrderNavigatorParamList = {
  FoodOrderHome?: {
    place?: Place;
  };
  AddressComplete?: {
    value?: string;
    returnScreen: 'FoodOrderHome';
    returnParam: string;
  };
  RestaurantNavigator: {
    restaurantId: string;
  } & NestedNavigatorParams<RestaurantNavigatorParamList>;
  RestaurantSearch: undefined;
  FilterScreen: undefined;
};
