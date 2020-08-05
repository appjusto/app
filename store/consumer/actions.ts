import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api';
import { Consumer } from './types';

// watch for updates
export const observeConsumer = (api: Api) => (courierId: string) => (dispatch: Dispatch<any>) => {
  const unsubscribe = api.observeConsumer(courierId, (consumer: Consumer): void => {
    dispatch({ type: actionTypes.CONSUMER_PROFILE_UPDATED, payload: consumer });
  });
  return unsubscribe;
};

// update data on backend
export const updateConsumer = (api: Api) => (consumerId: string, changes: object) => {
  return api.updateConsumer(consumerId, changes);
};
