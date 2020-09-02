import { ChatParamList } from '../../../Chat';

export type HistoryNavigatorParamList = {
  DeliveryHistory: undefined;
  OngoingOrder: {
    orderId: string;
  };
  Chat: ChatParamList;
};
