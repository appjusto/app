import { Place } from 'appjusto-types';

export type P2POrderNavigatorParamList = {
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Place;
    destination?: Place;
    paymentMethodId?: string;
  };
  AddressComplete: {
    returnScreen: 'CreateOrderP2P';
    returnParam: string;
    value?: Place;
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
  // Home: undefined;
};
// } & ChatParamList;
