import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api/api';
import Courier, { CourierObject } from './Courier';

// watch for updates
export const observeCourier = (api: Api) => (courierId: string) => (dispatch: Dispatch<any>) => {
  // watch profile changes
  const unsubscribeProfileUpdate = api
    .courier()
    .observeCourier(courierId, (courier: CourierObject): void => {
      dispatch({ type: actionTypes.COURIER_PROFILE_UPDATED, payload: courier });
    });
  // watch private info changes
  const unsubscribePrivateInfoUpdate = api
    .courier()
    .observeCourierPrivateInfo(courierId, (courier: CourierObject): void => {
      dispatch({ type: actionTypes.COURIER_PROFILE_UPDATED, payload: courier });
    });

  return (): void => {
    unsubscribeProfileUpdate();
    unsubscribePrivateInfoUpdate();
  };
};

export const updateCourier = (api: Api) => (courierId: string, changes: object) => {
  return api.courier().updateCourier(courierId, changes);
};

export const updateCourierLocation = (api: Api) => (courier: Courier, location) => (
  dispatch: Dispatch<any>
) => {
  api.courier().updateCourierLocation(courier, location);
  dispatch({ type: actionTypes.SET_LOCATION, payload: location });
};
