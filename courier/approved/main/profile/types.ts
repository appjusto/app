import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';

export type CourierProfileParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  ProfilePhotos: undefined;
  Terms: undefined;
  Bank: undefined;
  Fleet: undefined;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
} & ProfileEraseParamList;
