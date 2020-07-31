export type UnloggedStackParamList = {
  WelcomeScreen: undefined;
  SignInFeedback: {
    email: string;
  };
  // ConsumerRegistration: undefined;
  Terms: undefined;
};

export type HomeStackParamList = {
  ConsumerHome: undefined;
  CreateOrderP2P: {
    originAddress?: string;
    destinationAddress?: string;
  };
};
