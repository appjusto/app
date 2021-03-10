import { IssueType } from 'appjusto-types';

export type DeliveredOrderNavigatorParamList = {
  DeliveredOrderDetail: {
    orderId: string;
  };
  ReportIssue: {
    orderId: string;
    issueType: IssueType;
  };
};
