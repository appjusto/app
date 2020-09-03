import { ProfileParamList } from '../approved/profile/types';

export type PendingParamList = {
  PendingChecklist: undefined;
  ProfileFeedback: undefined;
} & ProfileParamList;
