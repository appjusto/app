import { ProfileEditParamList } from '../../../common/screens/profile/ProfileEdit';
import { ProfileEraseParamList } from '../../../common/screens/profile/ProfileErase';

export type ProfileParamList = {
  Profile: undefined;
  ProfilePhotos: undefined;
  Terms: undefined;
  Bank: undefined;
  Fleet: undefined;
} & ProfileEditParamList &
  ProfileEraseParamList;
