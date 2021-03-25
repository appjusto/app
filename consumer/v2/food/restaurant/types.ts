import { Place } from 'appjusto-types';
import { FleetDetailParamList } from '../../../../common/screens/fleet/FleetDetail';
import { PixParamList } from '../../common/PayWithPix';
import { ProfileAddCardParamList } from '../../main/profile/ProfileAddCard';
import { ProfilePaymentMethodsParamList } from '../../main/profile/ProfilePaymentMethods';

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
  AboutCharges: undefined;
} & PixParamList &
  FleetDetailParamList &
  ProfilePaymentMethodsParamList &
  ProfileAddCardParamList;
