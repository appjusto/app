import { CourierProfileParamList } from '../approved/main/profile/types';

export type PendingParamList = {
  ProfilePending: undefined;
  ProfileSubmitted: undefined;
  ProfileRejected: undefined;
} & CourierProfileParamList;
