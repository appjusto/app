export type HistoryParamList = {
  OrderHistory: undefined;
  OrderDetail: {
    orderId: string;
  };
  OrderMatching: {
    orderId: string;
  };
  ReviewCourier: {
    courierId: string;
    courierName: string;
    courierJoined: string;
    orderId: string;
  };
  OrderComplaint: {
    orderId: string;
  };
};
