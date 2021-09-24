export type DeliveriesNavigatorParamList = {
  DeliveryHistoryByMonth: {
    year: number;
    month: number;
  };
  DeliverySummary: {
    orderId: string;
  };
  Receivables: {
    receivableBalance: string;
  };
  AdvanceReceivables: {
    ids: number[];
  };
  Withdraws: {
    balanceForWithdraw?: number;
  };
  RequestWithdrawFeedback: {
    header: string;
    description: string;
  };
  AdvanceReceivablesFeedback: {
    header: string;
    description: string;
  };
};
