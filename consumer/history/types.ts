import { OrderCourier } from 'appjusto-types';

export type HistoryParamList = {
  OrderHistory: undefined;
  OrderDetail: {
    orderId: string;
  };
  OrderMatching: {
    orderId: string;
  };
  ReviewCourier: {
    courier: OrderCourier | undefined;
    orderId: string;
  };
  OrderComplaint: {
    orderId: string;
  };
};
