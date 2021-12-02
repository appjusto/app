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
  const deliveredOn = order.timestamps.delivered ?? order.deliveredOn;
  const confirmedOn = order.timestamps.confirmed ?? order.confirmedOn;
  const createdOn = order.timestamps.quote ?? order.createdOn;
  const time = deliveredOn ?? confirmedOn ?? createdOn;
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

export const getOrdersSince = (orders: WithId<Order>[], date: Date) =>
  orders.filter((order) => {
    return (getOrderTime(order)?.getTime() ?? 0) >= date.getTime();
  });

export const OngoingOrdersStatuses: OrderStatus[] = [
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
      courierFee:
        order.status === 'delivered'
          ? result.courierFee + (order.fare?.courier.value ?? 0) + (order.tip?.value ?? 0)
          : result.courierFee,
    }),
    { delivered: 0, canceled: 0, ongoing: 0, courierFee: 0 }
  )
);
