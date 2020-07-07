import * as actionTypes from '../actionTypes';

export const setCourierProfile = (profile) => (dispatch) => {
  dispatch({ type: actionTypes.COURIER_SET_PROFILE, payload: profile });
}

export const updateCourierStatus = (status) => (dispatch) => {
  dispatch({ type: actionTypes.COURIER_UPDATE_STATUS, payload: status });
};

export const updateCourierLocation = (api) => (courier, location, shouldBroadcast) => (dispatch) => {
  dispatch({ type: actionTypes.COURIER_UPDATE_LOCATION, payload: location });
  if (shouldBroadcast) {
    api.broadcastCourierLocation(courier, location);
  }
};

export const fetchAvailableCouriers = (api) => (dispatch) => {
  const unsubscribe = api.fetchAvailableCouriers((result) => {
    dispatch({ type: actionTypes.COURIER_UPDATE_VISIBLE_COURIERS, payload: result });
  });
  return unsubscribe;
}