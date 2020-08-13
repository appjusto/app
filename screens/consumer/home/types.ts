export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    originAddress?: string;
    destinationAddress?: string;
  };
  AddressComplete: {
    value: string;
    destinationScreen: 'CreateOrderP2P';
    destinationParam: string;
  };
  ProfileEdit?: {
    hideDeleteAccount?: boolean;
    allowPartialSave?: boolean;
  };
  ProfileCards?: {
    popCount?: number;
  };
  OrderFeedback: {
    orderId: string;
  };
  History: undefined;
};
