import { ChatMessageUser, Flavor, IssueType } from '@appjusto/types';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';
import { OrderCanceledParamList } from '../../../courier/approved/ongoing/OrderCanceled';
import { ProfilePaymentMethodsParamList } from '../main/profile/ProfilePaymentMethods';

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
    issueType: IssueType;
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
  OngoingOrderProblem: {
    orderId: string;
    chatFrom?: ChatMessageUser;
  };
  DeliveryProblemFeedback: {
    issueType: IssueType;
    orderId: string;
  };
  OngoingOrderDeclined: {
    orderId: string;
    paymentMethodId?: string;
  };
} & ReportIssueParamList &
  ProfilePaymentMethodsParamList &
  OrderCanceledParamList;
