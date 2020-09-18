import { ChatParamList } from '../../common/screens/Chat';

export type HistoryParamList = {
  OrderHistory: undefined;
  OngoingOrder: {
    orderId: string;
    newMessage?: boolean;
  };
  OrderSummary: {
    orderId: string;
  };
} & ChatParamList;
