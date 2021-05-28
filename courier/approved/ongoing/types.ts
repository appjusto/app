import { ChatMessageUser } from '@appjusto/types';
import { ChatParamList } from '../../../common/screens/Chat';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';
import { OrderCanceledParamList } from './OrderCanceled';

export type OngoingDeliveryNavigatorParamList = {
  OngoingDelivery: {
    orderId: string;
    chatFrom?: ChatMessageUser;
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
  DeliveryProblem: {
    orderId: string;
    chatFrom?: ChatMessageUser;
  };
  CallCourier: undefined;
} & ChatParamList &
  ReportIssueParamList &
  OrderCanceledParamList;
