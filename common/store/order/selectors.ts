import { first, memoize, merge, uniq } from 'lodash';
import { createSelector } from 'reselect';

import { State } from '..';
import { OrderState, Order, Place, OrderStatus, GroupedChatMessages } from './types';

export const getOrderState = (state: State): OrderState => state.order;

export const getOrderById = createSelector(getOrderState, (orderState) =>
  memoize((orderId: string) => orderState.ordersById[orderId])
);

export const getOrders = (state: State): Order[] => getOrderState(state).orders;

export type OrderSummary = {
  years: string[];
  months: string[];
  monthSummary?: {
    [key: string]: {
      deliveries: number;
      fee: number;
    };
  };
};

export const getOrdersSummary = createSelector(getOrders, (orders) => {
  return orders.reduce<OrderSummary>(
    (result, order) => {
      const createdOn = order.createdOn.toDate();
      const year = String(createdOn.getFullYear());
      const month = String(createdOn.getMonth());
      const key = `${year}/${month}`;
      const { deliveries, fee } = result.monthSummary?.[key] ?? { deliveries: 0, fee: 0 };
      return merge(result, {
        years: [year],
        months: [key],
        monthSummary: {
          [key]: {
            deliveries: deliveries + 1,
            fee: fee + order.fare.courierFee,
          },
        },
      });
    },
    { years: [], months: [] }
  );
});

export const getOngoingOrders = createSelector(getOrders, (orders) =>
  orders.filter((order) => order.status === OrderStatus.Dispatching)
);

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
