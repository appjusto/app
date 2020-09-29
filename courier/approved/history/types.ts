export type DeliveriesNavigatorParamList = {
  DeliveryHistory: undefined;
  DeliveryHistoryByMonth: {
    year: number;
    month: number;
  };
  DeliverySummary: {
    orderId: string;
  };
};
