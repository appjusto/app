import { ChatMessageUser, Flavor } from '@appjusto/types';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';
import { OrderCanceledParamList } from '../../../courier/approved/ongoing/OrderCanceled';

export type OngoingOrderNavigatorParamList = {
  OngoingOrderConfirming: {
    orderId: string;
    pixKey?: string;
    total?: number;
  };
  OngoingOrderNoMatch: {
    orderId: string;
  };
  OngoingOrder: {
    orderId: string;
    chatFrom?: ChatMessageUser;
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
    counterpartId: string;
    counterpartFlavor: Flavor;
  };
  OngoingOrderCancelFeedback: undefined;
} & ReportIssueParamList &
  OrderCanceledParamList;
