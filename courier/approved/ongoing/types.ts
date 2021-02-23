import { IssueType } from 'appjusto-types';
import { ChatParamList } from '../../../common/screens/Chat';

export type OngoingParamList = {
  OngoingDelivery: {
    orderId: string;
    newMessage?: boolean;
    completeWithoutConfirmation?: boolean;
  };
  DeliveryCompleted: {
    orderId: string;
    fee: number;
  };
  OrderCanceled: {
    orderId: string;
  };
  CancelOngoingDelivery: {
    orderId: string;
  };
  ReportIssueCourierDeliveryProblem: {
    issueType: IssueType;
    orderId: string;
  };
  NoCodeDelivery: {
    orderId: string;
  };
} & ChatParamList;
