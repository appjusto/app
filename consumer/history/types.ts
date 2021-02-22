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
  OrderComplaint: {
    orderId: string;
  };
  Home: undefined;
};
