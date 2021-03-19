import { ReportIssueParamList } from '../../../common/screens/ReportIssue';

export type OngoingOrderNavigatorParamList = {
  OngoingOrderConfirming: {
    orderId: string;
    pixKey?: string;
  };
  OngoingOrderNoMatch: {
    orderId: string;
  };
  OngoingOrder: {
    orderId: string;
    newMessage?: boolean;
  };
  OngoingOrderConfirmCancel: {
    orderId: string;
  };
  OngoingOrderCancelOrder: {
    orderId: string;
  };
  OngoingOrderCourierDetail: {
    orderId: string;
  };
  OngoingOrderFeedback: {
    orderId: string;
  };
  OngoingOrderChat: {
    orderId: string;
  };
} & ReportIssueParamList;
