export type DeliveriesNavigatorParamList = {
  DeliveryHistoryByMonth: {
    year: number;
    month: number;
  };
  DeliverySummary: {
    orderId: string;
  };
  Receivables: {
    receivableBalance?: string; // for tests
  };
  AdvanceReceivables: {
    ids: number[];
  };
};
