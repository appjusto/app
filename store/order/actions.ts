import { AppDispatch } from '../../screens/app/context';
import Api from '../api/api';
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
): Promise<string[][]> => {
  const result = await api.maps().googlePlacesAutocomplete(input, sessiontoken);
  return result.map((result) => [
    result.structured_formatting.main_text,
    result.structured_formatting.secondary_text,
  ]);
};

export const createOrder = (api: Api) => (origin: Place, destination: Place) => {
  return api.order().createOrder(origin, destination);
};

export const confirmOrder = (api: Api) => (orderId: string, cardId: string) => {
  return api.order().confirmOrder(orderId, cardId);
};

export const cancelOrder = (api: Api) => (orderId: string) => {
  return api.order().cancelOrder(orderId);
};

export const matchOrder = (api: Api) => (orderId: string) => {
  return api.order().matchOrder(orderId);
};
