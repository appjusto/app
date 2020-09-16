import { OrderMatchPushMessageData } from 'appjusto-types';

export type ApprovedParamList = {
  Main: undefined;
  Matching: {
    matchRequest: OrderMatchPushMessageData;
  };
  MatchingFeedback: undefined;
};

export type MainParamList = {
  Home: undefined;
  Deliveries: undefined;
  Profile: undefined;
};
