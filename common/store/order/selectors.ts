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
  const time = order.timestamps?.delivered ?? order.timestamps?.confirmed ?? order.createdOn;
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
  'confirming',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
];

export const isOrderOngoing = (order: Order) => OngoingOrdersStatuses.includes(order.status);

type OrdersSummary = {
  [K in OrderStatus]?: number;
};

export const summarizeOrders2 = memoize((orders: WithId<Order>[] = []) =>
  orders.reduce(
    (result, order) => ({
      quote: order.status === 'quote' ? (result.quote ?? 0) + 1 : result.quote,
      confirming: order.status === 'confirming' ? (result.confirming ?? 0) + 1 : result.confirming,
      charged: order.status === 'charged' ? (result.charged ?? 0) + 1 : result.charged,
      confirmed: order.status === 'confirmed' ? (result.confirmed ?? 0) + 1 : result.confirmed,
      scheduled: order.status === 'scheduled' ? (result.scheduled ?? 0) + 1 : result.scheduled,
      preparing: order.status === 'preparing' ? (result.preparing ?? 0) + 1 : result.preparing,
      ready: order.status === 'ready' ? (result.ready ?? 0) + 1 : result.ready,
      dispatching:
        order.status === 'dispatching' ? (result.dispatching ?? 0) + 1 : result.dispatching,
      delivered: order.status === 'delivered' ? (result.delivered ?? 0) + 1 : result.delivered,
      canceled: order.status === 'canceled' ? (result.canceled ?? 0) + 1 : result.canceled,
      rejected: order.status === 'rejected' ? (result.rejected ?? 0) + 1 : result.rejected,
      declined: order.status === 'declined' ? (result.declined ?? 0) + 1 : result.declined,
      expired: order.status === 'expired' ? (result.expired ?? 0) + 1 : result.expired,
    }),
    {
      quote: 0,
      confirming: 0,
      charged: 0,
      confirmed: 0,
      scheduled: 0,
      preparing: 0,
      ready: 0,
      dispatching: 0,
      delivered: 0,
      canceled: 0,
      rejected: 0,
      declined: 0,
      expired: 0,
    } as OrdersSummary
  )
);
