import { Place, Order, ChatMessage, WithId, Fare } from 'appjusto-types';
import { CancelToken } from 'axios';

import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { ObserveOrdersOptions } from '../api/order';
import { BUSY, awaitWithFeedback } from '../ui/actions';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';
export const ORDER_CHAT_UPDATED = 'ORDER_CHAT_UPDATED';

// consumers
export const getAddressAutocomplete = (api: Api) => (
  input: string,
  sessionToken: string,
  cancelToken?: CancelToken
) => async (dispatch: AppDispatch) => {
  return dispatch(
    awaitWithFeedback(api.maps().googlePlacesAutocomplete(input, sessionToken, cancelToken))
  );
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
  paymentMethodId: string,
  fleetId: string,
  platformFee: number
) => (dispatch: AppDispatch) => {
  return dispatch(
    awaitWithFeedback(
      api.order().confirmOrder(orderId, origin, destination, paymentMethodId, fleetId, platformFee)
    )
  );
};

export const tipCourier = (api: Api) => (orderId: string, tip: number) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().tipCourier(orderId, tip)));
};

export const cancelOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.order().cancelOrder(orderId)));
};

export const deleteOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return await api.order().deleteOrder(orderId);
};

// couriers

export const matchOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.order().matchOrder(orderId)));
};

export const nextDispatchingState = (api: Api) => (orderId: string) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().nextDispatchingState(orderId)));
};

export const completeDelivery = (api: Api) => (orderId: string) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().completeDelivery(orderId)));
};

// both courier & consumer

export const observeOrders = (api: Api) => (options: ObserveOrdersOptions) => (
  dispatch: AppDispatch
) => {
  return api.order().observeOrders(options, (orders: WithId<Order>[]): void => {
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
    from === order.consumer.id ? 'couriers' : 'consumers';
  const to = destination === 'consumers' ? order.consumer.id : order.courier!.id;
  const chat: Partial<ChatMessage> = { from, to, message, destination };
  const result = await api.order().sendMessage(order.id, chat);
  dispatch({ type: BUSY, payload: false });
  return result;
};
