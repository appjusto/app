import { IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';

export type ProfileParamList = {
  ProfileEdit: undefined;
  ProfilePaymentMethods?: {
    returnScreen: string;
  };
  ProfileAddCard?: {
    returnScreen: string;
  };
  PaymentMethodDetail: {
    paymentData: IuguCustomerPaymentMethod;
  };
  Terms: undefined;
} & ProfileEraseParamList;
