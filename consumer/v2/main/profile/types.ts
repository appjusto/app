import { Card, PayableWith, WithId } from '@appjusto/types';
import { ProfileEditParamList } from '../../../../common/screens/profile/CommonProfileEdit';
import { PhoneVerificationParamList } from '../../../../common/screens/profile/PhoneVerificationScreen';
import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';
import { ProfileAddCardParamList } from './ProfileAddCard';
import { ProfilePaymentMethodsParamList } from './ProfilePaymentMethods';

export type ProfileParamList = {
  PaymentMethodDetail: {
    paymentData: WithId<Card>;
  };
  Terms: undefined;
  NotificationPreferences: undefined;
  AboutApp: undefined;
  RequestProfileEdit: undefined;
  SelectPaymentMethod: {
    selectedPaymentMethodId?: string | null;
    payMethod?: PayableWith;
    returnScreen: 'FoodOrderCheckout' | 'CreateOrderP2P';
    orderId?: string;
  };
} & ProfileEraseParamList &
  ProfilePaymentMethodsParamList &
  ProfileAddCardParamList &
  ProfileEditParamList &
  PhoneVerificationParamList;
