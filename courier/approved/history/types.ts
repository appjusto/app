import { ChatParamList } from '../../../common/screens/Chat';

export type HistoryNavigatorParamList = {
  DeliveryHistory: undefined;
  OngoingOrder: {
    orderId: string;
  };
} & ChatParamList;
