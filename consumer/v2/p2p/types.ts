import { Place } from 'appjusto-types';
import { FleetDetailParamList } from '../../../common/screens/fleet/FleetDetail';
import { AddressCompleteParamList } from '../common/AddressComplete';
import { PixParamList } from '../common/PayWithPix';
import { ProfileAddCardParamList } from '../main/profile/ProfileAddCard';
import { ProfilePaymentMethodsParamList } from '../main/profile/ProfilePaymentMethods';

export type P2POrderNavigatorParamList = {
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Place;
    destination?: Place;
    paymentMethodId?: string;
  };
  TransportableItems: undefined;
} & AddressCompleteParamList &
  PixParamList &
  FleetDetailParamList &
  ProfilePaymentMethodsParamList &
  ProfileAddCardParamList;
// } & ChatParamList;

export enum Step {
  Origin = 0,
  Destination,
  Confirmation,
  ConfirmingOrder,
}
