import { ChatMessageUser, IssueType } from '@appjusto/types';
import { ChatParamList } from '../../../common/screens/Chat';
import { OrderCanceledParamList } from '../../../common/screens/orders/OrderCanceled';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';

export type OngoingDeliveryNavigatorParamList = {
  OngoingDelivery: {
    orderId: string;
    chatFrom?: ChatMessageUser;
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
  DeliveryProblem: {
    orderId: string;
    chatFrom?: ChatMessageUser;
  };
  DeliveryProblemFeedback: {
    issueType: IssueType;
    orderId: string;
  };
  CourierDropsOrder: {
    orderId: string;
    issueType: IssueType;
  };
  CallCourier: undefined;
  OrderNull: undefined;
} & ChatParamList &
  ReportIssueParamList &
  OrderCanceledParamList;
