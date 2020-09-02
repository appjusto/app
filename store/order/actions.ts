import { CancelToken } from 'axios';

import { AppDispatch } from '../../screens/app/context';
import Api from '../api/api';
import { AutoCompleteResult } from '../api/maps';
import { ObserveOrdersOptions } from '../api/order';
import { BUSY } from '../ui/actions';
import { Place, Order, ChatMessage } from './types';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';
export const ORDER_CHAT_UPDATED = 'ORDER_CHAT_UPDATED';

// consumers
export const getAddressAutocomplete = (api: Api) => (
  input: string,
  sessionToken: string,
  cancelToken: CancelToken
) => async (dispatch: AppDispatch): Promise<AutoCompleteResult[] | null> => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.maps().googlePlacesAutocomplete(input, sessionToken, cancelToken);
  dispatch({ type: BUSY, payload: false });
  return result;
};

export const createOrder = (api: Api) => (origin: Place, destination: Place) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.order().createOrder(origin, destination);
  dispatch({ type: BUSY, payload: false });
  return result;
};

export const confirmOrder = (api: Api) => (orderId: string, cardId: string) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.order().confirmOrder(orderId, cardId);
  dispatch({ type: BUSY, payload: false });
  return result;
};

export const cancelOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.order().cancelOrder(orderId);
  dispatch({ type: BUSY, payload: false });
  return result;
};

// couriers

export const matchOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.order().matchOrder(orderId);
  dispatch({ type: BUSY, payload: false });
  return result;
};

export const nextDispatchingState = (api: Api) => (orderId: string) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.order().nextDispatchingState(orderId);
  dispatch({ type: BUSY, payload: false });
  return result;
};

export const completeDelivery = (api: Api) => (orderId: string) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.order().completeDelivery(orderId);
  dispatch({ type: BUSY, payload: false });
  return result;
};

// both courier & consumer

export const observeOrders = (api: Api) => (options: ObserveOrdersOptions) => (
  dispatch: AppDispatch
) => {
  return api.order().observeOrders(options, (orders: Order[]): void => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
  });
};

export const observeOrderChat = (api: Api) => (orderId: string) => (dispatch: AppDispatch) => {
  return api.order().observeOrderChat(orderId, (messages: ChatMessage[]): void => {
    dispatch({ type: ORDER_CHAT_UPDATED, payload: { orderId, messages } });
  });
};

export const sendMessage = (api: Api) => (order: Order, from: string, message: string) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BUSY, payload: true });
  const to = order.courierId === from ? order.consumerId : order.courierId;
  const result = await api.order().sendMessage(order.id, from, to!, message);
  dispatch({ type: BUSY, payload: false });
  return result;
};
