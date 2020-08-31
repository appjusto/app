import { OrderMatchRequest } from '../../../store/order/types';

export type ApprovedParamList = {
  Main: undefined;
  Matching: {
    matchRequest: OrderMatchRequest;
  };
  MatchingFeedback: undefined;
};

export type MainParamList = {
  Home: undefined;
  Deliveries: undefined;
  Profile: undefined;
};
