import { ChatMessageUser, Flavor, IssueType } from '@appjusto/types';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';
import { OrderCanceledParamList } from '../../../courier/approved/ongoing/OrderCanceled';
import { ProfileAddCardParamList } from '../main/profile/ProfileAddCard';
import { ProfilePaymentMethodsParamList } from '../main/profile/ProfilePaymentMethods';
import { MainNavigatorParamList } from '../main/types';

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
  };
  OngoingOrderDeclined: {
    orderId: string;
    paymentMethodId?: string;
  };
  OrderProblemFeedback: {
    orderId: string;
  };
} & ReportIssueParamList &
  ProfilePaymentMethodsParamList &
  OrderCanceledParamList &
  ProfileAddCardParamList &
  MainNavigatorParamList;
