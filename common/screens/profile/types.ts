export type ProfileParamList = {
  Profile: undefined;
  ProfileEdit?: {
    hideDeleteAccount?: boolean;
    allowPartialSave?: boolean;
  };
  ProfileErase: undefined;
  ProfilePhotos: undefined;
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfileBank?: {
    bank: {
      bankId: string;
      bankName: string;
    };
  };
  SelectBank: undefined;
  Terms: undefined;

  CreateOrderP2P: {
    cardId: string;
  };
};
