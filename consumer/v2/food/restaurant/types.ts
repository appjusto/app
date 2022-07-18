import { Fare, PayableWith, Place } from '@appjusto/types';
import { FleetDetailParamList } from '../../../../common/screens/fleet/FleetDetail';
import { PixParamList } from '../../common/PayWithPix';
import { ProfileAddCardParamList } from '../../main/profile/ProfileAddCard';
import { ProfilePaymentMethodsParamList } from '../../main/profile/ProfilePaymentMethods';
import { ProfileParamList } from '../../main/profile/types';

export type RestaurantNavigatorParamList = {
  RestaurantDetail: undefined;
  RestaurantHeaderMessage: undefined;
  AboutRestaurant: undefined;
  ItemDetail: {
    productId: string;
    itemId?: string;
  };
  FoodOrderCheckout?: {
    destination?: Place;
    paymentMethodId?: string;
    returningFare?: Fare;
    payMethod?: PayableWith;
  };
  OrderDestination: {
    returnScreen: 'FoodOrderCheckout';
    returnParam: string;
    value?: Place | null;
  };
  AboutCharges: undefined;
  AvailableFleets: {
    orderId: string;
    selectedFare: Fare;
    returnScreen: 'FoodOrderCheckout' | 'CreateOrderP2P';
  };
  ScheduleOrder: undefined;
  SelectPaymentMethod: {
    selectedPaymentMethodId?: string;
    orderId?: string;
    fleetId?: string;
    total?: number;
  };
} & PixParamList &
  FleetDetailParamList &
  ProfilePaymentMethodsParamList &
  ProfileAddCardParamList &
  ProfileParamList;
