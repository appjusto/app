import { IssueType } from 'appjusto-types';

export type HistoryParamList = {
  OrderHistory: undefined;
  OrderDetail: {
    orderId: string;
  };
  OrderConfirming: {
    orderId: string;
  };
  ReviewCourier: {
    courierId: string;
    courierName: string;
    courierJoined: string;
    orderId: string;
  };
  ReportIssueViaHistory: {
    issueType: IssueType;
    orderId: string;
  };
  Home: undefined;
};
