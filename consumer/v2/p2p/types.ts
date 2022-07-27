import { Fare, Place } from '@appjusto/types';
import { PayableWith } from '../../../../types';
import { FleetDetailParamList } from '../../../common/screens/fleet/FleetDetail';
import { AddressCompleteParamList } from '../common/AddressComplete';
import { PixParamList } from '../common/PayWithPix';
import { ProfileAddCardParamList } from '../main/profile/ProfileAddCard';
import { ProfilePaymentMethodsParamList } from '../main/profile/ProfilePaymentMethods';
import { ProfileParamList } from '../main/profile/types';

export type P2POrderNavigatorParamList = {
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Place;
    destination?: Place;
    paymentMethodId?: string;
    returningFare?: Fare;
    payMethod?: PayableWith;
  };
  TransportableItems: undefined;
  AboutCharges: undefined;
  AvailableFleets: {
    orderId: string;
    selectedFare: Fare;
    returnScreen: 'FoodOrderCheckout' | 'CreateOrderP2P';
  };
  SelectPaymentMethod: {
    selectedPaymentMethodId?: string;
    payMethod?: PayableWith;
    returnScreen: 'FoodOrderCheckout' | 'CreateOrderP2P';
    orderId?: string;
  };
} & AddressCompleteParamList &
  PixParamList &
  FleetDetailParamList &
  ProfilePaymentMethodsParamList &
  ProfileAddCardParamList &
  ProfileParamList;
// } & ChatParamList;

export enum Step {
  Origin = 0,
  Destination,
  Confirmation,
  ConfirmingOrder,
}
