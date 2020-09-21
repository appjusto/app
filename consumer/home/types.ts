import { Address } from 'appjusto-types';

import { ChatParamList } from '../../common/screens/Chat';

export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Address;
    destination?: Address;
    cardId?: string;
  };
  AddressComplete: {
    value?: string;
    returnScreen: 'CreateOrderP2P';
    returnParam: string;
  };
  ProfileEdit: undefined;
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  OrderConfirmedFeedback: {
    orderId: string;
  };
  OngoingOrder: {
    orderId: string;
    newMessage?: boolean;
  };
  OrderDeliveredFeedback: {
    orderId: string;
  };
  // OrderRefused: undefined; // for testing
} & ChatParamList;
