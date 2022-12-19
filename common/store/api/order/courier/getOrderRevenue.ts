import { Order } from '@appjusto/types';

export const getOrderRevenue = (order: Order) => {
  if (!order.fare?.courier) return 0;
  let value =
    order.fare.courier.paid === undefined
      ? order.fare.courier.value - (order.fare.courier.processing?.value ?? 0)
      : order.fare.courier.paid;
  if (order.tip?.value && order.tip.status === 'paid') {
    value += order.tip.value - (order.tip?.processing?.value ?? 0);
  }
  return value;
};
