import { ChatMessage, Order, WithId } from 'appjusto-types';
import { first, memoize, uniq } from 'lodash';
import { createSelector } from 'reselect';
import { State } from '..';
import { GroupedChatMessages, OrderState } from './types';

export const getOrderState = (state: State): OrderState => state.order;

export const getOrderById = createSelector(getOrderState, (orderState) =>
  memoize((orderId: string) => orderState.ordersById[orderId])
);

export const getOrders = (state: State) => getOrderState(state).orders;

export const getOrderCreatedOn = (order: WithId<Order>) =>
  order.createdOn ? (order.createdOn as firebase.firestore.Timestamp).toDate() : null;

export const getOngoingOrders = (orders: WithId<Order>[]) =>
  orders.filter((o) => o.status === 'dispatching');

export const getYearsWithOrders = (orders: WithId<Order>[]) =>
  uniq(orders.map((order) => getOrderCreatedOn(order)?.getFullYear()));

export const getMonthsWithOrdersInYear = (orders: WithId<Order>[]) =>
  memoize((year: number) =>
    uniq(
      orders
        .filter((order) => getOrderCreatedOn(order)?.getFullYear() === year)
        .map((order) => getOrderCreatedOn(order)?.getMonth())
    )
  );

export const getOrdersWithFilter = (
  orders: WithId<Order>[],
  year: number,
  month?: number,
  day?: number
) =>
  orders.filter((order) => {
    const createdOn = getOrderCreatedOn(order);
    if (!createdOn) return false;
    if (year !== createdOn.getFullYear()) return false;
    if (month && month !== createdOn.getMonth()) return false;
    if (day && day !== createdOn.getDate()) return false;
    return true;
  });

export const getDeliveredOrders = (orders: WithId<Order>[]) =>
  orders.filter((order) => order.status === 'delivered');

export const getOrdersSince = (orders: WithId<Order>[], date: Date) =>
  orders.filter((order) => {
    return (getOrderCreatedOn(order)?.getTime() ?? 0) >= date.getTime();
  });

export const summarizeOrders = memoize((orders: WithId<Order>[]) =>
  orders.reduce(
    (result, order) => ({
      delivered: order.status === 'delivered' ? result.delivered + 1 : result.delivered,
      dispatching: order.status === 'dispatching' ? result.dispatching + 1 : result.dispatching,
      courierFee:
        order.status === 'delivered'
          ? result.courierFee + (order.fare?.consumer.courierFee ?? 0) + (order.tip?.value ?? 0)
          : result.courierFee,
    }),
    { delivered: 0, dispatching: 0, courierFee: 0 }
  )
);

// chat messages

export const groupOrderChatMessages = (messages: WithId<ChatMessage>[]) =>
  messages.reduce<GroupedChatMessages[]>((groups, message) => {
    const currentGroup = first(groups);
    if (message.from.id === currentGroup?.from) {
      currentGroup!.messages.push(message);
      return groups;
    }
    // use as id for chat group the id of the first message of the group
    return [{ id: message.id, from: message.from.id, messages: [message] }, ...groups];
  }, []);
