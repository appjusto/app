import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api/api';
import { ConsumerProfile } from './types/Consumer';

// watch for updates
export const observeConsumer = (api: Api) => (courierId: string) => (dispatch: Dispatch<any>) => {
  const unsubscribe = api
    .consumer()
    .observeConsumer(courierId, (consumer: ConsumerProfile): void => {
      dispatch({ type: actionTypes.CONSUMER_PROFILE_UPDATED, payload: consumer });
    });
  return unsubscribe;
};

// update data on backend
export const updateConsumer = (api: Api) => (consumerId: string, changes: object) => {
  return api.consumer().updateConsumer(consumerId, changes);
};
