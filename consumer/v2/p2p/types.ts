import { Place } from 'appjusto-types';
import { FleetDetailParamList } from '../../../common/screens/fleet/FleetDetail';
import { AddressCompleteParamList } from '../common/AddressComplete';
import { PixParamList } from '../common/PayWithPix';

export type P2POrderNavigatorParamList = {
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Place;
    destination?: Place;
    paymentMethodId?: string;
  };
  TransportableItems: undefined;
  ProfileAddCard: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfilePaymentMethods: {
    returnScreen: 'CreateOrderP2P';
  };
} & AddressCompleteParamList &
  PixParamList &
  FleetDetailParamList;
// } & ChatParamList;

export enum Step {
  Origin = 0,
  Destination,
  Confirmation,
  ConfirmingOrder,
}
