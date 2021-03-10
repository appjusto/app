import { IssueType } from 'appjusto-types';

export type OngoingOrderNavigatorParamList = {
  OngoingOrderConfirming: {
    orderId: string;
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
  OngoingOrderCanceled: {
    orderId: string;
  };
  OngoingOrderCourierDetail: {
    orderId: string;
  };
  OngoingOrderFeedback: {
    orderId: string;
  };
  ReportIssue: {
    orderId: string;
    issueType: IssueType;
  };
  OngoingOrderChat: {
    orderId: string;
  };
};
