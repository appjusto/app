import { Place, Order, ChatMessage, WithId, Fare } from 'appjusto-types';
import { CancelToken } from 'axios';

import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { AutoCompleteResult } from '../api/maps';
import { ObserveOrdersOptions } from '../api/order';
import { Flavor } from '../config/types';
import { BUSY, awaitWithFeedback } from '../ui/actions';

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

export const createOrder = (api: Api) => (
  origin: Partial<Place>,
  destination: Partial<Place>
) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.order().createOrder(origin, destination)));
};

export const getOrderQuotes = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback<Fare[]>(api.order().getOrderQuotes(orderId)));
};

export const confirmOrder = (api: Api) => (
  orderId: string,
  origin: Partial<Place>,
  destination: Partial<Place>,
  cardId: string,
  fleetId: string,
  platformFee: number
) => (dispatch: AppDispatch) => {
  return dispatch(
    awaitWithFeedback(
      api.order().confirmOrder(orderId, origin, destination, cardId, fleetId, platformFee)
    )
  );
};

export const cancelOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  dispatch({ type: BUSY, payload: true });
  const result = await api.order().cancelOrder(orderId);
  dispatch({ type: BUSY, payload: false });
  return result;
};

export const deleteOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return await api.order().deleteOrder(orderId);
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
  return api.order().observeOrderChat(orderId, (messages: WithId<ChatMessage>[]): void => {
    dispatch({ type: ORDER_CHAT_UPDATED, payload: { orderId, messages } });
  });
};

export const sendMessage = (api: Api) => (
  order: WithId<Order>,
  from: string,
  message: string
) => async (dispatch: AppDispatch) => {
  dispatch({ type: BUSY, payload: true });
  const destination: 'consumers' | 'couriers' =
    from === order.consumerId ? 'couriers' : 'consumers';
  const to = destination === 'consumers' ? order.consumerId : order.courier!.id;
  const chat: Partial<ChatMessage> = { from, to, message, destination };
  const result = await api.order().sendMessage(order.id, chat);
  dispatch({ type: BUSY, payload: false });
  return result;
};
