import { createSelector } from 'reselect';

import { State } from '..';
import { OrderState, Order, Place, OrderStatus, GroupedChatMessages } from './types';

export const getOrderState = (state: State): OrderState => state.order;

export const getOrderById = (state: State) => (id: string): Order =>
  getOrderState(state).ordersById[id];

export const getOrderChat = (id: string) => (state: State): GroupedChatMessages[] =>
  getOrderState(state).chatByOrderId[id];

export const getOrders = (state: State): Order[] => getOrderState(state).orders;

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
