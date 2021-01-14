import {
  ChatMessage,
  CreateOrderPayload,
  Fare,
  LatLng,
  OrderIssue,
  OrderRejection,
  PlaceOrderPayload,
  Review,
  WithId,
} from 'appjusto-types';
import { CancelToken } from 'axios';
import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';
export const ORDER_CHAT_UPDATED = 'ORDER_CHAT_UPDATED';
export const ORDER_CHAT_MESSAGE_READ = 'ORDER_CHAT_MESSAGE_READ';

// consumers
export const getAddressAutocomplete = (api: Api) => (
  input: string,
  sessionToken: string,
  cancelToken?: CancelToken,
  coords?: LatLng
) => async (dispatch: AppDispatch) => {
  return dispatch(
    awaitWithFeedback(api.maps().googlePlacesAutocomplete(input, sessionToken, cancelToken, coords))
  );
};

export const getReverseGeocodeAdress = (api: Api) => (coords: LatLng) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.maps().googleReverseGeocode(coords)));
};

export const createOrder = (api: Api) => (payload: CreateOrderPayload) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().createOrder(payload)));
};

export const getOrderQuotes = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback<Fare[]>(api.order().getOrderQuotes(orderId)));
};

export const placeOrder = (api: Api) => (payload: PlaceOrderPayload) => (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.order().placeOrder(payload)));
};

export const tipCourier = (api: Api) => (orderId: string, tip: number) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().tipCourier(orderId, tip)));
};

export const cancelOrder = (api: Api) => (orderId: string, cancellation?: OrderIssue) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().cancelOrder(orderId, cancellation)));
};

export const deleteOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return await api.order().deleteOrder(orderId);
};

export const sendOrderProblem = (api: Api) => (orderId: string, problem: OrderIssue) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().sendOrderProblem(orderId, problem)));
};

export const sendCourierReview = (api: Api) => (orderId: string, review: Review) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().sendCourierReview(orderId, review)));
};

// couriers

export const matchOrder = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.order().matchOrder(orderId)));
};

export const rejectOrder = (api: Api) => (orderId: string, rejection: OrderRejection) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.order().rejectOrder(orderId, rejection)));
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

export const sendCourierOrderProblem = (api: Api) => (
  orderId: string,
  problem: OrderIssue
) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.order().sendCourierOrderProblem(orderId, problem)));
};

// both courier & consumer
export const markMessageAsRead = (orderId: string, message: WithId<ChatMessage>) => (
  dispatch: AppDispatch
) => {
  dispatch({ type: ORDER_CHAT_MESSAGE_READ, payload: { orderId, message } });
};
