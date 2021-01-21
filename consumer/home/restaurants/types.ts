import { Address } from 'appjusto-types';

export type RestaurantsNavigatorParamList = {
  RestaurantsHome?: {
    address?: Address;
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
