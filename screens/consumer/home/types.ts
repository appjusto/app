export type HomeStackParamList = {
  ConsumerHome: undefined;
  CreateOrderP2P: {
    originAddress?: string;
    destinationAddress?: string;
  };
  AddressComplete: {
    value: string;
    destinationScreen: string;
    destinationParam: string;
  };
};
