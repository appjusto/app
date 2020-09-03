import { ProfileEditParamList } from '../../../common/screens/profile/ProfileEdit';
import { ProfileEraseParamList } from '../../../common/screens/profile/ProfileErase';

export type ProfileParamList = {
  Profile: undefined;
  ProfileEdit: ProfileEditParamList;
  ProfilePhotos: undefined;
  ProfileBank?: {
    bank: {
      bankId: string;
      bankName: string;
    };
  };
  SelectBank: undefined;
  Terms: undefined;
  ProfileErase: ProfileEraseParamList;
};
