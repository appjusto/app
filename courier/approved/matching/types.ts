import { OrderMatchPushMessageData } from 'appjusto-types';

export type MatchingParamList = {
  Matching: {
    matchRequest: OrderMatchPushMessageData;
  };
  RefuseDelivery: {
    orderId: string;
  };
  MatchingError: undefined;
};
