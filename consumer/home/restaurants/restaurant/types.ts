import { Place } from 'appjusto-types';

export type RestaurantNavigatorParamList = {
  RestaurantDetail: undefined;
  AboutRestaurant: undefined;
  ItemDetail: {
    productId: string;
    itemId?: string;
  };
  OrderCheckout?: {
    destination?: Place;
    paymentMethodId?: string;
  };
  AddressComplete: {
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
};
