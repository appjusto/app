import { IuguCustomerPaymentMethod } from '@appjusto/types/payment/iugu';
import { ProfileEditParamList } from '../../../../common/screens/profile/CommonProfileEdit';
import { PhoneVerificationParamList } from '../../../../common/screens/profile/PhoneVerificationScreen';
import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';
import { ProfileAddCardParamList } from './ProfileAddCard';
import { ProfilePaymentMethodsParamList } from './ProfilePaymentMethods';

export type ProfileParamList = {
  PaymentMethodDetail: {
    paymentData: IuguCustomerPaymentMethod;
  };
  Terms: undefined;
  NotificationPreferences: undefined;
  AboutApp: undefined;
  RequestProfileEdit: undefined;
  SelectPaymentMethod: undefined;
} & ProfileEraseParamList &
  ProfilePaymentMethodsParamList &
  ProfileAddCardParamList &
  ProfileEditParamList &
  PhoneVerificationParamList;
