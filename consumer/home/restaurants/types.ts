import { Place } from 'appjusto-types';

export type RestaurantsNavigatorParamList = {
  RestaurantsHome?: {
    place?: Place;
    selectedFilter?: string;
  };
  AddressComplete?: {
    value?: string;
    returnScreen: 'RestaurantsHome';
    returnParam: string;
  };
  CartSummary: undefined; // while building the screen
  RestaurantNavigator: {
    restaurantId: string;
  };
  RestaurantSearch: undefined;
  OrderBy: undefined;
};
