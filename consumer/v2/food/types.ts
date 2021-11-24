import { Place } from '@appjusto/types';
import { NestedNavigatorParams } from '../../../common/types';
import { AddressCompleteParamList } from '../common/AddressComplete';
import { RestaurantNavigatorParamList } from './restaurant/types';

export type FoodOrderNavigatorParamList = {
  FoodOrderHome?: {
    place?: Place;
  };
  RestaurantSearch: undefined;
  RecommendRestaurant?: {
    place?: Place;
  };
  RecommendationFeedback: undefined;
  RestaurantNavigator: {
    restaurantId: string;
    orderId?: string;
  } & NestedNavigatorParams<RestaurantNavigatorParamList>;
  FilterScreen: undefined;
} & AddressCompleteParamList;
