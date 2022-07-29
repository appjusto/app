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
  OrderProblemFeedback: {
    orderId: string;
  };
} & ReportIssueParamList;
