import { ChatParamList } from '../../../common/screens/Chat';

export type DeliveriesNavigatorParamList = {
  DeliveryHistory: undefined;
  DeliveryHistoryByMonth: {
    year: number;
    month: number;
  };
  OngoingDelivery: {
    orderId: string;
    newMessage?: boolean;
  };
  DeliverySummary: {
    orderId: string;
  };
} & ChatParamList;
