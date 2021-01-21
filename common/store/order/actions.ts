import { ChatMessage, Fare, OrderIssue, OrderRejection, Review, WithId } from 'appjusto-types';
import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';
export const ORDER_CHAT_UPDATED = 'ORDER_CHAT_UPDATED';
export const ORDER_CHAT_MESSAGE_READ = 'ORDER_CHAT_MESSAGE_READ';

// consumers

export const getOrderQuotes = (api: Api) => (orderId: string) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback<Fare[]>(api.order().getOrderQuotes(orderId)));
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
