import { ChatParamList } from '../../../common/screens/Chat';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';
import { OrderCanceledParamList } from './OrderCanceled';

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
  CancelOngoingDelivery: {
    orderId: string;
  };
  NoCodeDelivery: {
    orderId: string;
  };
} & ChatParamList &
  ReportIssueParamList &
  OrderCanceledParamList;
