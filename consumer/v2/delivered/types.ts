import { ReportIssueParamList } from '../common/ReportIssue';

export type DeliveredOrderNavigatorParamList = {
  DeliveredOrderDetail: {
    orderId: string;
  };
} & ReportIssueParamList;
