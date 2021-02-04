import { ChatParamList } from '../../../common/screens/Chat';

export type OngoingParamList = {
  OngoingDelivery: {
    orderId: string;
    newMessage?: boolean;
  };
  DeliveryCompleted: {
    orderId: string;
    fee: number;
  };
  OrderCanceled: {
    orderId: string;
  };
  CancelOngoingDelivery: {
    orderId: string;
  };
  CourierDeliveryProblem: {
    orderId: string;
  };
  NoCodeDelivery: undefined;
} & ChatParamList;
