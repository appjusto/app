import { Place } from '@appjusto/types';
import { SearchFilter } from '../../../common/store/consumer/types';
import { NestedNavigatorParams } from '../../../common/types';
import { AddressCompleteParamList } from '../common/AddressComplete';
import { RestaurantNavigatorParamList } from './restaurant/types';

export type FoodOrderNavigatorParamList = {
  FoodOrderHome?: {
    place?: Place;
  };
  RestaurantSearch?: {
    filters: SearchFilter[];
  };
  RecommendRestaurant?: {
    place?: Place;
    returnToHome?: boolean;
  };
  RecommendationFeedback?: {
    returnToHome?: boolean;
  };
  RestaurantNavigator: {
    restaurantId: string;
    orderId?: string;
  } & NestedNavigatorParams<RestaurantNavigatorParamList>;
  FilterScreen: undefined;
} & AddressCompleteParamList;
