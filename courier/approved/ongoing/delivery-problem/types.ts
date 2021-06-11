import { IssueType } from '@appjusto/types';
import { OngoingDeliveryNavigatorParamList } from '../types';

export type DeliveryProblemNavigatorParamList = {
  DeliveryProblemFeedback: {
    issueType: IssueType;
    orderId: string;
  } & OngoingDeliveryNavigatorParamList;
};
