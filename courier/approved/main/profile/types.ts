import { ProfileEraseParamList } from '../../../../common/screens/profile/ProfileErase';
import { NestedNavigatorParams } from '../../../../common/types';
import { BankParamList } from './bank/types';
import { FleetParamList } from './fleet/types';

export type CourierProfileParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  ProfileCompany: undefined;
  ProfilePhotos: undefined;
  Terms: undefined;
  BankNavigator: NestedNavigatorParams<BankParamList>;
  FleetNavigator: NestedNavigatorParams<FleetParamList>;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
} & ProfileEraseParamList;
