import { OrderMatchRequest } from '../../../../store/types';

export type HomeParamList = {
  Home: undefined;
  PermissionDeniedFeedback: undefined;
  Matching: {
    order: OrderMatchRequest;
  };
};
