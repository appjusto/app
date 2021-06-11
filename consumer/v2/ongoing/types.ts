import { ChatMessageUser, Flavor, IssueType } from '@appjusto/types';
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
    acknowledgedCosts: number;
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
  DeliveryProblemFeedback: {
    issueType: IssueType;
    orderId: string;
  };
  OngoingOrderCancelFeedback: undefined;
} & ReportIssueParamList &
  OrderCanceledParamList;
