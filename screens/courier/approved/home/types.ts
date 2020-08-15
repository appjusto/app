import { OrderMatchRequest } from '../../../../store/order/types';

export type HomeParamList = {
  Home: undefined;
  PermissionDeniedFeedback: undefined;
  Matching: {
    matchRequest: OrderMatchRequest;
  };
};
