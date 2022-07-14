import { Order, OrderStatus, WithId } from '@appjusto/types';
import firebase from 'firebase';
import { memoize, uniq } from 'lodash';
import { createSelector } from 'reselect';
import { State } from '..';
import { OrderState } from './types';

export const getOrderState = (state: State): OrderState => state.order;

export const getOrderById = createSelector(getOrderState, (orderState) =>
  memoize((orderId: string) => orderState.ordersById[orderId])
);

export const getOrders = (state: State) => getOrderState(state).orders;

export const getOrderTime = (order: WithId<Order>) => {
  const time = order.timestamps.delivered ?? order.timestamps.confirmed ?? order.createdOn;
  if (time) return (time as firebase.firestore.Timestamp).toDate();
  return new Date();
};

export const getYearsWithOrders = (orders: WithId<Order>[]) =>
  uniq(orders.map((order) => getOrderTime(order).getFullYear()));

export const getMonthsWithOrdersInYear = (orders: WithId<Order>[]) =>
  memoize((year: number) =>
    uniq(
      orders
        .filter((order) => getOrderTime(order).getFullYear() === year)
        .map((order) => getOrderTime(order).getMonth())
    )
  );

export const getOrdersWithFilter = (
  orders: WithId<Order>[],
  year: number,
  month?: number,
  day?: number
) =>
  orders.filter((order) => {
    const time = getOrderTime(order);
    if (!time) return false;
    if (year !== time.getFullYear()) return false;
    if (month && month !== time.getMonth()) return false;
    if (day && day !== time.getDate()) return false;
    return true;
  });

export const getDeliveredOrders = (orders: WithId<Order>[]) =>
  orders.filter((order) => order.status === 'delivered');

export const filterOrdersByStatus = (orders: WithId<Order>[], status: OrderStatus) =>
  orders.filter((order) => order.status === status);

export const getOrdersSince = (orders: WithId<Order>[], date: Date) =>
  orders.filter((order) => {
    return (getOrderTime(order)?.getTime() ?? 0) >= date.getTime();
  });

export const OngoingOrdersStatuses: OrderStatus[] = [
  'scheduled',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
];

export const isOrderOngoing = (order: Order) => OngoingOrdersStatuses.includes(order.status);

export const summarizeOrders = memoize((orders: WithId<Order>[]) =>
  orders.reduce(
    (result, order) => ({
      delivered: order.status === 'delivered' ? result.delivered + 1 : result.delivered,
      canceled: order.status === 'canceled' ? result.canceled + 1 : result.canceled,
      ongoing: isOrderOngoing(order) ? result.ongoing + 1 : result.ongoing,
      quote: order.status === 'quote' ? result.quote + 1 : result.quote,
      scheduled: order.status === 'scheduled' ? result.scheduled + 1 : result.scheduled,
      total:
        order.status === 'delivered' ||
        order.status === 'canceled' ||
        isOrderOngoing(order) ||
        order.status === 'quote'
          ? result.total + 1
          : result.total,
      courierFee:
        order.status === 'delivered'
          ? result.courierFee +
            ((order.fare!.courier?.value ?? 0) - (order.fare!.courier?.financialFee ?? 0)) +
            ((order.tip?.value ?? 0) - (order.tip?.financialFee ?? 0))
          : result.courierFee,
    }),
    { delivered: 0, canceled: 0, ongoing: 0, quote: 0, scheduled: 0, total: 0, courierFee: 0 }
  )
);

type OrdersSummary = {
  [K in OrderStatus]?: number;
};

export const summarizeOrders2 = memoize((orders: WithId<Order>[] = []) =>
  orders.reduce(
    (result, order) => ({
      confirmed: order.status === 'confirmed' ? (result.confirmed ?? 0) + 1 : result.confirmed,
      preparing: order.status === 'preparing' ? (result.preparing ?? 0) + 1 : result.preparing,
      ready: order.status === 'ready' ? (result.ready ?? 0) + 1 : result.ready,
      dispatching:
        order.status === 'dispatching' ? (result.dispatching ?? 0) + 1 : result.dispatching,
      delivered: order.status === 'delivered' ? (result.delivered ?? 0) + 1 : result.delivered,
      canceled: order.status === 'canceled' ? (result.canceled ?? 0) + 1 : result.canceled,
    }),
    {
      confirmed: 0,
      preparing: 0,
      ready: 0,
      dispatching: 0,
      delivered: 0,
      canceled: 0,
    } as OrdersSummary
  )
);
