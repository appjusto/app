import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api';
import { Consumer } from '../types/consumer';

// update data on backend
export const updateConsumer = (api: Api) => (consumerId: string, changes: object) => {
  return api.updateConsumer(consumerId, changes);
};

// watch for updates
export const watchConsumer = (api: Api) => (courierId: string) => (dispatch: Dispatch<any>) => {
  const unsubscribe = api.watchConsumer(courierId, (consumer: Consumer): void => {
    dispatch({ type: actionTypes.CONSUMER_PROFILE_UPDATED, payload: consumer });
  });
  return unsubscribe;
};
