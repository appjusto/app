import { ChatParamList } from '../../../common/screens/Chat';

export type HistoryNavigatorParamList = {
  DeliveryHistory: undefined;
  DeliveryHistoryByMonth: {
    year: number;
    month: number;
  };
  OngoingOrder: {
    orderId: string;
  };
} & ChatParamList;
