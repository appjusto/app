import { PermissionDeniedParamList } from '../../common/screens/PermissionDenied';
import { HowAppJustoWorksParams } from '../approved/main/howitworks/types';
import { CourierProfileParamList } from '../approved/main/profile/types';

export type UnapprovedParamList = {
  ProfilePending: undefined;
  ProfileSubmitted: undefined;
  CourierOnboarding: undefined;
  AboutApp: undefined;
} & CourierProfileParamList &
  HowAppJustoWorksParams &
  PermissionDeniedParamList;
