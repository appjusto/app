import { CourierProfileParamList } from '../approved/main/profile/types';

export type PendingParamList = {
  PendingChecklist: undefined;
  ProfileFeedback: undefined;
} & CourierProfileParamList;
