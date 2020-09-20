import { Order, OrderStatus, Place, WithId } from 'appjusto-types';
import { first, memoize, uniq } from 'lodash';
import { createSelector } from 'reselect';

import { State } from '..';
import { OrderState, GroupedChatMessages } from './types';

export const getOrderState = (state: State): OrderState => state.order;

export const getOrderById = createSelector(getOrderState, (orderState) =>
  memoize((orderId: string) => orderState.ordersById[orderId])
);

export const getOrders = (state: State) => getOrderState(state).orders;

export const getOngoingOrders = createSelector(getOrders, (orders) =>
  orders.filter((order) => order.status === 'dispatching')
);

export const getYearsWithOrders = createSelector(getOrders, (orders) =>
  uniq(
    orders.map((order) => (order.createdOn as firebase.firestore.Timestamp).toDate().getFullYear())
  )
);

export const getMonthsWithOrdersInYear = createSelector(getOrders, (orders) =>
  memoize((year: number) =>
    uniq(
      orders
        .filter(
          (order) =>
            (order.createdOn as firebase.firestore.Timestamp).toDate().getFullYear() === year
        )
        .map((order) => (order.createdOn as firebase.firestore.Timestamp).toDate().getMonth())
    )
  )
);

export const getOrdersWithFilter = (
  orders: WithId<Order>[],
  year: number,
  month?: number,
  day?: number
) =>
  orders.filter((order) => {
    const createdOn = (order.createdOn as firebase.firestore.Timestamp).toDate();
    if (year !== createdOn.getFullYear()) return false;
    if (month && month !== createdOn.getMonth()) return false;
    if (day && day !== createdOn.getDate()) return false;
    return true;
  });

export const getDeliveredOrders = (orders: WithId<Order>[]) =>
  orders.filter((order) => order.status === 'delivered');

export const getOrdersSince = (orders: WithId<Order>[], date: Date) =>
  orders.filter((order) => {
    const createdOn = (order.createdOn as firebase.firestore.Timestamp).toDate();
    return createdOn.getTime() >= date.getTime();
  });

export const summarizeOrders = memoize((orders: WithId<Order>[]) =>
  orders.reduce(
    (result, order) => ({
      delivered: order.status === 'delivered' ? result.delivered + 1 : result.delivered,
      dispatching: order.status === 'dispatching' ? result.dispatching + 1 : result.dispatching,
      courierFee:
        order.status === 'delivered'
          ? result.courierFee + (order.fare?.courierFee ?? 0)
          : result.courierFee,
    }),
    { delivered: 0, dispatching: 0, courierFee: 0 }
  )
);

export const getPlacesFromPreviousOrders = createSelector(getOrders, (orders) =>
  orders.reduce<Place[]>((places, order) => {
    let result = places;
    const { origin, destination } = order;
    if (!result.some((place) => place.address?.description === origin.address?.description))
      result = [...result, origin];
    if (!result.some((place) => place.address?.description === destination.address?.description))
      result = [...result, destination];

    return result;
  }, [])
);

export const getOrderChat = createSelector(getOrderState, (orderState) =>
  memoize((orderId: string) => {
    const messages = orderState.chatByOrderId[orderId];
    return messages.reduce<GroupedChatMessages[]>((groups, message) => {
      const currentGroup = first(groups);
      if (message.from === currentGroup?.from) {
        currentGroup!.messages.push(message);
        return groups;
      }
      // use as id for chat group the id of the first message of the group
      return [{ id: message.id, from: message.from, messages: [message] }, ...groups];
    }, []);
  })
);
