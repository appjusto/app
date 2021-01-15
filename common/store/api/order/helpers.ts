import { Order } from 'appjusto-types';
import { OrderItem } from 'appjusto-types/order/item';

export const addItemToOrder = (order: Order, item: OrderItem): Order => {
  if (!order?.items) return { ...order, items: [{ ...item }] };
  const index = order.items.findIndex((i) => i.product.id === item.product.id);
  if (index === -1) return { ...order, items: [...order.items, item] };
  return {
    ...order,
    items: [
      ...order.items.slice(0, index),
      mergeItems(order.items[index], item),
      ...order.items.slice(index + 1),
    ],
  };
};

const mergeItems = (a: OrderItem, b: OrderItem): OrderItem => ({
  ...a,
  ...b,
  quantity: a.quantity + b.quantity,
});
