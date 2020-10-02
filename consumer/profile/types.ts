import { ProfileEraseParamList } from '../../common/screens/profile/ProfileErase';

export type ProfileParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  Terms: undefined;
  CreateOrderP2P: {
    paymentMethodId: string;
  };
} & ProfileEraseParamList;
