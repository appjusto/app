import { ChatMessageUser, Flavor, IssueType } from '@appjusto/types';
import { OrderCanceledParamList } from '../../../common/screens/orders/OrderCanceled';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';
import { ProfileAddCardParamList } from '../main/profile/ProfileAddCard';
import { ProfilePaymentMethodsParamList } from '../main/profile/ProfilePaymentMethods';
import { MainNavigatorParamList } from '../main/types';

export type OngoingOrderNavigatorParamList = {
  OngoingOrderConfirming: {
    orderId: string;
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
  ChangeRoute: undefined;
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
