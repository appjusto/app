import { ProfileEditParamList } from '../../common/screens/profile/ProfileEdit';
import { ProfileEraseParamList } from '../../common/screens/profile/ProfileErase';

export type ProfileParamList = {
  Profile: undefined;
  ProfileEdit: ProfileEditParamList;
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  Terms: undefined;
  ProfileErase: ProfileEraseParamList;
  CreateOrderP2P: {
    cardId: string;
  };
};
