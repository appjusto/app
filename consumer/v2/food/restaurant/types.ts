import { Place } from 'appjusto-types';
import { FleetDetailParamList } from '../../../../common/screens/fleet/FleetDetail';
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
    returnScreen: 'FoodOrderCheckout';
    returnParam: string;
    value?: Place | null;
  };
  ProfileAddCard?: {
    returnScreen: 'FoodOrderCheckout';
  };
  ProfilePaymentMethods?: {
    returnScreen: 'FoodOrderCheckout';
  };
} & PixParamList &
  FleetDetailParamList;
