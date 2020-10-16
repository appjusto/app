import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';

export type CourierProfileParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  ProfileCompany: undefined;
  ProfilePhotos: undefined;
  Terms: undefined;
  BankNavigator: undefined;
  FleetNavigator: undefined;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
} & ProfileEraseParamList;
