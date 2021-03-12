import { ChatParamList } from '../../../common/screens/Chat';
import { ReportIssueParamList } from '../../../consumer/v2/common/ReportIssue';

export type OngoingOrderNavigatorParamList = {
  OngoingDelivery: {
    orderId: string;
    newMessage?: boolean;
    completeWithoutConfirmation?: boolean;
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
  NoCodeDelivery: {
    orderId: string;
  };
} & ChatParamList &
  ReportIssueParamList;
