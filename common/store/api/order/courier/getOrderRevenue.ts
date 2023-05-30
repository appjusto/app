import { Order } from '@appjusto/types';

export const getOrderRevenue = (order: Order) => {
  let value = 0;
  if (!order.fare?.courier) value = 0;
  else if (order.fare.courier.paid) value = order.fare.courier.paid;
  else if (order.fare.courier.netValue) {
    value = order.fare.courier.netValue + (order.fare.courier.locationFee ?? 0);
  }
  if (order.tip?.value && order.tip.status === 'paid') {
    value += order.tip.value - (order.tip?.processing?.value ?? 0);
  }
  (order.fare?.courier?.extras ?? []).forEach((extra) => {
    value += extra.value;
  });

  return value;
};
