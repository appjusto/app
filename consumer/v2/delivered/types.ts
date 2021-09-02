import { ReportIssueParamList } from '../../../common/screens/ReportIssue';

export type DeliveredOrderNavigatorParamList = {
  DeliveredOrderDetail: {
    orderId: string;
  };
  OrderHistoryByMonth: {
    year: number;
    month: number;
  };
} & ReportIssueParamList;
