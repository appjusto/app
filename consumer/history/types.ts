export type HistoryParamList = {
  OrderHistory: undefined;
  OrderSummary: {
    orderId: string;
  };
  OrderMatching: {
    orderId: string;
  };
  ReviewCourier: {
    courierId: string | undefined;
  };
};
