import { IssueType } from 'appjusto-types';

export type DeliveredOrderNavigatorParamList = {
  DeliveredOrderDetail: {
    orderId: string;
  };
  DeliveredOrderFeedback: {
    orderId: string;
  };
  DeliveredOrderReportIssue: {
    orderId: string;
    issueType: IssueType;
  };
};
