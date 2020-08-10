export type HomeStackParamList = {
  ConsumerHome: undefined;
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
    nextScreen?: 'ProfileCards';
    nextScreenParams?: {
      popCount?: number;
    };
  };
  ProfileCards?: {
    popCount?: number;
  };
};
