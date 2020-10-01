import { OrderMatchPushMessageData } from 'appjusto-types';

export type MatchingParamList = {
  Matching: {
    matchRequest: OrderMatchPushMessageData;
  };
  MatchingRefused: undefined;
  MatchingError: undefined;
};
