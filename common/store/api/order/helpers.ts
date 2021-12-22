import {
  ComplementGroup,
  Order,
  OrderItem,
  OrderItemComplement,
  Product,
  WithId,
} from '@appjusto/types';
import { isEmpty } from 'lodash';
import { distanceBetweenLatLng } from '../helpers';
import { track } from '../track';

// items

export const addItemToOrder = (order: Order, item: OrderItem): Order => {
  track('user added one item to the order');
  if (!order?.items) return { ...order, items: [{ ...item }] };
  // searching for items for the same product that could be merged into one item
  const index = order.items.findIndex(
    (i) =>
      i.product.id === item.product.id &&
      // items with complement or notes are always added separatedly
      isEmpty(i.complements) &&
      isEmpty(item.complements) &&
      isEmpty(i.notes) &&
      isEmpty(item.notes)
  );
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

export const updateItem = (order: Order, item: OrderItem): Order => {
  if (!order.items) return order;
  const index = order.items?.findIndex((i) => i.id === item.id);
  if (index === -1) return order;
  return {
    ...order,
    items: [...order.items.slice(0, index), item, ...order.items.slice(index + 1)],
  };
};

export const removeItem = (order: Order, item: OrderItem): Order => {
  if (!order.items) return order;
  track('user removed one item from the order');
  const index = order.items?.findIndex((i) => i.id === item.id);
  if (index === -1) return order;
  track('user removed one item from the order');
  return {
    ...order,
    items: [...order.items.slice(0, index), ...order.items.slice(index + 1)],
  };
};

const mergeItems = (a: OrderItem, b: OrderItem): OrderItem => ({
  ...a,
  ...b,
  quantity: a.quantity + b.quantity,
});

export const getItemTotal = (item: OrderItem) => {
  const complemementsTotal = (item.complements ?? []).reduce(
    (total, complement) => total + complement.price * (complement.quantity ?? 1),
    0
  );
  return item.quantity * (item.product.price + complemementsTotal);
};

// complements

export const totalComplements = (
  group: WithId<ComplementGroup>,
  complements: OrderItemComplement[]
) =>
  complements
    .filter((c) => c.group.id === group.id)
    .reduce((total, complement) => total + complement.quantity, 0);

export const canAddComplement = (
  group: WithId<ComplementGroup>,
  complements: OrderItemComplement[]
) => totalComplements(group, complements) < group.maximum;

export const hasSatisfiedGroup = (
  group: WithId<ComplementGroup>,
  complements: OrderItemComplement[]
) => {
  const total = totalComplements(group, complements);
  return total >= group.minimum && total <= group.maximum;
};

export const hasSatisfiedAllGroups = (product: Product, complements: OrderItemComplement[]) =>
  product.complementsGroups?.every((group) => hasSatisfiedGroup(group, complements)) ?? true;

// total

export const getOrderTotal = (order: Order) =>
  (order.items ?? []).reduce((sum, item) => sum + getItemTotal(item), 0);

// location

export const courierNextPlace = (order: Order) => {
  const { dispatchingState, origin, destination } = order;
  if (!dispatchingState || dispatchingState === 'going-pickup') return origin;
  if (dispatchingState === 'arrived-pickup') return destination;
  if (dispatchingState === 'going-destination') return destination;
  if (dispatchingState === 'arrived-destination') return destination;
  return null;
};

export const courierDistanceFromNextPlace = (order: Order) => {
  const { courier } = order;
  if (!courier?.location) return 0;
  const nextPlace = courierNextPlace(order);
  if (!nextPlace?.location) return 0;
  return distanceBetweenLatLng(courier.location, nextPlace.location);
};
