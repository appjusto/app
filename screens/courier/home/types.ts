import { OrderMatchRequest } from '../../../store/types';

export type HomeStackParamList = {
  CourierHome: undefined;
  PermissionDeniedFeedback: undefined;
  Matching: {
    order: OrderMatchRequest;
  };
};
