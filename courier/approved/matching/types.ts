import { CourierOrderRequest, IssueType } from '@appjusto/types';

export type MatchingParamList = {
  OrderRequests: undefined;
  Matching: {
    matchRequest: CourierOrderRequest;
  };
  // remove this after
  RefuseDelivery: {
    issueType: IssueType;
    orderId: string;
  };
  RejectedMatching: {
    orderId: string;
  };
  RejectedMatchingFeedback: undefined;
  MatchingError: undefined;
};
