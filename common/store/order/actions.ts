import { Fare, OrderIssue } from '@appjusto/types';
import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';

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
