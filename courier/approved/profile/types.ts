import { ProfileEditParamList } from '../../../common/screens/profile/ProfileEdit';
import { ProfileEraseParamList } from '../../../common/screens/profile/ProfileErase';

export type ProfileParamList = {
  Profile: undefined;
  ProfilePhotos: undefined;
  Camera: undefined;
  Terms: undefined;
  Bank: undefined;
} & ProfileEditParamList &
  ProfileEraseParamList;
