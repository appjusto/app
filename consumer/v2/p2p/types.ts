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
  // ProfileEdit: undefined;
  // OrderConfirming: {
  //   orderId: string;
  // };
  // OrderNoMatch: {
  //   orderId: string;
  // };
  // OngoingOrder: {
  //   orderId: string;
  //   newMessage?: boolean;
  // };
  // CourierDetail: {
  //   orderId: string;
  // };
  // ReportIssueOngoingOrder: {
  //   issueType: IssueType;
  //   orderId: string;
  // };
  // ConfirmCancelOrder: {
  //   orderId: string;
  // };
  // CancelOrder: {
  //   orderId: string;
  // };
  // OrderDeliveredFeedback: {
  //   orderId: string;
  // };
  // Home: undefined;
};
// } & ChatParamList;
