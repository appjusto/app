import { first, memoize, uniq } from 'lodash';
import { createSelector } from 'reselect';

import { State } from '..';
import { OrderState, Order, Place, OrderStatus, GroupedChatMessages } from './types';

export const getOrderState = (state: State): OrderState => state.order;

export const getOrderById = createSelector(getOrderState, (orderState) =>
  memoize((orderId: string) => orderState.ordersById[orderId])
);

export const getOrders = (state: State): Order[] => getOrderState(state).orders;

export const getOngoingOrders = createSelector(getOrders, (orders) =>
  orders.filter((order) => order.status === OrderStatus.Dispatching)
);

export const getYearsWithOrders = createSelector(getOrders, (orders) =>
  uniq(orders.map((order) => order.createdOn.toDate().getFullYear()))
);

export const getMonthsWithOrdersInYear = createSelector(getOrders, (orders) =>
  memoize((year: number) =>
    uniq(
      orders
        .filter((order) => order.createdOn.toDate().getFullYear() === year)
        .map((order) => order.createdOn.toDate().getMonth())
    )
  )
);

export const getOrdersWithFilter = createSelector(getOrders, (orders) =>
  memoize((year: number, month?: number) => {
    return orders.filter((order) => {
      const createdOn = order.createdOn.toDate();
      if (createdOn.getFullYear() !== year) return false;
      return month === undefined || createdOn.getMonth() === month;
    });
  })
);

export const summarizeOrders = memoize((orders: Order[]) => ({
  deliveries: orders.length,
  courierFee: orders.reduce((result, order) => result + order.fare.courierFee, 0),
}));

export const getPlacesFromPreviousOrders = createSelector(getOrders, (orders) =>
  orders.reduce<Place[]>((places, order) => {
    let result = places;
    const { origin, destination } = order;
    if (!result.some((place) => place.address === origin.address)) result = [...result, origin];
    if (!result.some((place) => place.address === destination.address))
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
        currentGroup.messages.push(message);
        return groups;
      }
      // use as id for chat group the id of the first message of the group
      return [{ id: message.id, from: message.from, messages: [message] }, ...groups];
    }, []);
  })
);
