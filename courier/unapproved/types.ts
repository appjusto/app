import { PermissionDeniedParamList } from '../../common/screens/PermissionDenied';
import { CourierProfileParamList } from '../approved/main/profile/types';

export type UnapprovedParamList = {
  ProfilePending: undefined;
  ProfileSubmitted: undefined;
  ProfileRejected: undefined;
  CourierOnboarding: undefined;
  AboutTests: undefined;
} & CourierProfileParamList &
  PermissionDeniedParamList;
