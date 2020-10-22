import { Order, OrderCourier, WithId } from 'appjusto-types';

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
    orderId: string;
  };
  OrderComplaint: {
    order: WithId<Order>;
  };
};
