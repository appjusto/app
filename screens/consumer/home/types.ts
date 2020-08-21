import { Place } from '../../../store/order/types';

export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    origin?: Place;
    destination?: Place;
    cardId?: string;
  };
  AddressComplete: {
    value?: Place;
    destinationScreen: 'CreateOrderP2P';
    destinationParam: string;
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
