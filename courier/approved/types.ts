import { OrderMatchPushMessageData } from 'appjusto-types';

import { ChatParamList } from '../../common/screens/Chat';

export type ApprovedParamList = {
  Main: undefined;
  Matching: {
    matchRequest: OrderMatchPushMessageData;
  };
  MatchingFeedback: undefined;
  OngoingDelivery: {
    orderId: string;
    newMessage?: boolean;
  };
  OrderCompleted: {
    orderId: string;
    fee: number;
  };
} & ChatParamList;

export type MainParamList = {
  Home: undefined;
  Deliveries: undefined;
  Profile: undefined;
};
