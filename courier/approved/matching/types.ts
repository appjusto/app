import { CourierOrderRequest, IssueType } from '@appjusto/types';

export type MatchingParamList = {
  OrderRequests: undefined;
  Matching: {
    matchRequest: CourierOrderRequest;
  };
  RefuseDelivery: {
    issueType: IssueType;
    orderId: string;
  };
  MatchingError: undefined;
};
