import { ChatMessageUser, IssueType } from '@appjusto/types';
import { ChatParamList } from '../../../common/screens/Chat';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';
import { OrderCanceledParamList } from './OrderCanceled';

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
  DropOrderFeedback: undefined;
  CallCourier: undefined;
  OrderNull: undefined;
} & ChatParamList &
  ReportIssueParamList &
  OrderCanceledParamList;
