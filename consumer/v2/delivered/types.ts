import { Flavor } from '@appjusto/types';
import { ReportIssueParamList } from '../../../common/screens/ReportIssue';

export type DeliveredOrderNavigatorParamList = {
  DeliveredOrderDetail: {
    orderId: string;
  };
  DeliveredOrderChat: {
    orderId: string;
    counterpartId: string;
    counterpartFlavor: Flavor;
  };
  OrderHistoryByMonth: {
    year: number;
    month: number;
  };
  OrderProblemFeedback: {
    orderId: string;
  };
} & ReportIssueParamList;
