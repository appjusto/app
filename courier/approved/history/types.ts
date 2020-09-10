import { ChatParamList } from '../../../common/screens/Chat';

export type DeliveriesNavigatorParamList = {
  DeliveryHistory: undefined;
  DeliveryHistoryByMonth: {
    year: number;
    month: number;
  };
  OngoingDelivery: {
    orderId: string;
  };
  DeliverySummary: {
    orderId: string;
  };
} & ChatParamList;
