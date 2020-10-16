import { IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
import { ProfileEraseParamList } from '../../common/screens/profile/ProfileErase';

export type ProfileParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  PaymentMethodDetail: {
    paymentData: IuguCustomerPaymentMethod;
  };
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  Terms: undefined;
  CreateOrderP2P: {
    paymentMethodId: string;
  };
} & ProfileEraseParamList;
