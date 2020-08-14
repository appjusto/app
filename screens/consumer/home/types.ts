export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    originAddress?: string;
    destinationAddress?: string;
    cardId?: string;
  };
  AddressComplete: {
    value: string;
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
