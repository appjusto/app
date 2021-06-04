import { OrderIssue } from '@appjusto/types';
import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const ORDERS_UPDATED = 'ORDERS_UPDATED';

// consumers

export const cancelOrder =
  (api: Api) => (orderId: string, cancellation?: OrderIssue) => async (dispatch: AppDispatch) => {
    return dispatch(awaitWithFeedback(api.order().cancelOrder(orderId, cancellation)));
  };
