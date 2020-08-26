import { AppDispatch } from '../../screens/app/context';
import Api from '../api/api';
import { AutoCompleteResult } from '../api/maps';
import { BLOCK_UI } from '../ui/actions';
import { Place, Order } from './types';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';

// watch for updates
export const observeOrdersCreatedBy = (api: Api) => (consumerId: string) => (
  dispatch: AppDispatch
) => {
  return api.order().observeOrdersCreatedBy(consumerId, (orders: Order[]): void => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
  });
};

export const observeOrdersDeliveredBy = (api: Api) => (courierId: string) => (
  dispatch: AppDispatch
) => {
  return api.order().observeOrdersDeliveredBy(courierId, (orders: Order[]): void => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
  });
};

export const getAddressAutocomplete = (api: Api) => async (
  input: string,
  sessiontoken: string
): Promise<AutoCompleteResult[]> => {
  return api.maps().googlePlacesAutocomplete(input, sessiontoken);
};

export const createOrder = (api: Api) => (origin: Place, destination: Place) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BLOCK_UI, payload: true });
  const result = await api.order().createOrder(origin, destination);
  dispatch({ type: BLOCK_UI, payload: false });
  return result;
};

export const confirmOrder = (api: Api) => (orderId: string, cardId: string) => async (
  dispatch: AppDispatch
) => {
  dispatch({ type: BLOCK_UI, payload: true });
  const result = await api.order().confirmOrder(orderId, cardId);
  dispatch({ type: BLOCK_UI, payload: false });
  return result;
};

export const cancelOrder = (api: Api) => (orderId: string) => {
  return api.order().cancelOrder(orderId);
};

export const matchOrder = (api: Api) => (orderId: string) => {
  return api.order().matchOrder(orderId);
};
