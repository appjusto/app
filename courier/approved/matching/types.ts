import { IssueType, OrderMatchPushMessageData } from '@appjusto/types';

export type MatchingParamList = {
  Matching: {
    matchRequest: OrderMatchPushMessageData;
  };
  RefuseDelivery: {
    issueType: IssueType;
    orderId: string;
  };
  MatchingError: undefined;
};
