import { ChatParamList } from '../../../common/screens/Chat';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';

export type OngoingDeliveryNavigatorParamList = {
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
