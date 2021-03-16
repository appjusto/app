import { Place } from 'appjusto-types';
import { PixParamList } from '../../common/PayWithPix';

export type RestaurantNavigatorParamList = {
  RestaurantDetail: undefined;
  AboutRestaurant: undefined;
  ItemDetail: {
    productId: string;
    itemId?: string;
  };
  FoodOrderCheckout?: {
    destination?: Place;
    paymentMethodId?: string;
  };
  OrderDestination: {
    returnScreen: 'OrderCheckout';
    returnParam: string;
    value?: Place | null;
  };
  ProfileAddCard?: {
    returnScreen: 'OrderCheckout';
  };
  ProfilePaymentMethods?: {
    returnScreen: 'OrderCheckout';
  };
  FleetDetail: {
    fleetId: string;
  };
} & PixParamList;
