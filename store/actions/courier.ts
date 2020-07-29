import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api';
import { Courier } from '../types/courier';

// update data on backend
export const updateCourier = (api: Api) => (courierId: string, changes: object) => (
  dispatch: Dispatch<any>
) => {
  api.updateCourier(courierId, changes);
};

export const updateCourierLocation = (api: Api) => (courier: Courier, location) => (
  dispatch: Dispatch<any>
) => {
  api.updateCourierLocation(courier, location);
  dispatch({ type: actionTypes.SET_LOCATION, payload: location });
};

// watch for updates
export const watchCourier = (api: Api) => (courierId: string) => (dispatch: Dispatch<any>) => {
  const unsubscribe = api.watchCourier(courierId, (courier: Courier) => {
    dispatch({ type: actionTypes.COURIER_PROFILE_UPDATED, payload: courier });
  });
  return unsubscribe;
};

export const watchAvailableCouriers = (api: Api) => (dispatch: Dispatch<any>) => {
  const unsubscribe = api.watchAvailableCouriers((result) => {
    dispatch({ type: actionTypes.AVAILABLE_COURIERS_UPDATED, payload: result });
  });
  return unsubscribe;
};
