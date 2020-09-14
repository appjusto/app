import { Place } from 'appjusto-types';

export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    orderId: string;
    origin?: Place;
    destination?: Place;
    cardId?: string;
  };
  AddressComplete: {
    value?: string;
    returnScreen: 'CreateOrderP2P';
    returnParam: string;
  };
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  OrderFeedback: {
    orderId: string;
  };
  History: undefined;
};
