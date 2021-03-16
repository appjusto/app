import { Place } from 'appjusto-types';
import { AddressCompleteParamList } from '../common/AddressComplete';

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
  FleetDetail: {
    fleetId: string;
  };
  PayWithPix: undefined;
} & AddressCompleteParamList;
// } & ChatParamList;

export enum Step {
  Origin = 0,
  Destination,
  Confirmation,
  ConfirmingOrder,
}
