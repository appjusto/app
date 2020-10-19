import { OrderCourier } from "appjusto-types";

export type HistoryParamList = {
  OrderHistory: undefined;
  OrderSummary: {
    orderId: string;
  };
  OrderMatching: {
    orderId: string;
  };
  ReviewCourier: {
    courier: OrderCourier | undefined;
  };
};
