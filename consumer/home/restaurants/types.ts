import { Place } from 'appjusto-types';
import { NestedNavigatorParams } from '../../../common/types';
import { RestaurantNavigatorParamList } from './restaurant/types';

export type RestaurantsNavigatorParamList = {
  RestaurantsHome?: {
    place?: Place;
  };
  AddressComplete?: {
    value?: string;
    returnScreen: 'RestaurantsHome';
    returnParam: string;
  };
  RestaurantNavigator: {
    restaurantId: string;
  } & NestedNavigatorParams<RestaurantNavigatorParamList>;
  RestaurantSearch: undefined;
  FilterScreen: undefined;
};
