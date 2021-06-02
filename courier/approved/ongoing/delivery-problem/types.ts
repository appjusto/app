import { IssueType } from '@appjusto/types';

export type DeliveryProblemNavigatorParamList = {
  DeliveryProblemFeedback: {
    issueType: IssueType;
    orderId: string;
  };
};
