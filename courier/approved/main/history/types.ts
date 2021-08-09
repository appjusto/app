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
};
