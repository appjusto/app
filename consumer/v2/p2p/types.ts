import { Place } from 'appjusto-types';
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
  };
  TransportableItems: undefined;
  AboutCharges: undefined;
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
