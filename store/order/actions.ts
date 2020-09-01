import { CancelToken } from 'axios';

import { AppDispatch } from '../../screens/app/context';
import Api from '../api/api';
import { AutoCompleteResult } from '../api/maps';
import { BUSY } from '../ui/actions';
import { Place, Order } from './types';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';

// consumers
export const observeOrdersCreatedBy = (api: Api) => (consumerId: string) => (
  dispatch: AppDispatch
) => {
  return api.order().observeOrdersCreatedBy(consumerId, (orders: Order[]): void => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
  });
};

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

export const observeOrdersDeliveredBy = (api: Api) => (courierId: string) => (
  dispatch: AppDispatch
) => {
  return api.order().observeOrdersDeliveredBy(courierId, (orders: Order[]): void => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
  });
};

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
