import { ChatParamList } from '../../../common/screens/Chat';

export type OngoingParamList = {
  OngoingDelivery: {
    orderId: string;
    newMessage?: boolean;
  };
  CancelOngoingDelivery: {
    orderId: string;
  };
  DeliveryCompleted: {
    orderId: string;
    fee: number;
  };
} & ChatParamList;
