import * as actionTypes from '../actionTypes';

// change local state only; won't broadcast to backend
export const setCourierProfile = (profile) => (dispatch) => {
  dispatch({ type: actionTypes.SET_COURIER_PROFILE, payload: profile });
}

// update data on backend
export const updateCourierStatus = (api) => (courier, status) => (dispatch) => {
  api.updateCourierStatus(courier, status);
};

export const updateCourierLocation = (api) => (courier, location, shouldBroadcast) => (dispatch) => {
  if (!shouldBroadcast) {
    dispatch({ type: actionTypes.SET_COURIER_LOCATION, payload: location });
  }
  else {
    api.updateCourierLocation(courier, location);
  }
};

// watch for updates
export const watchCourier = (api) => (profile) => (dispatch) => {
  const unsubscribe = api.watchCourier(profile, (courier) => {
    dispatch({ type: actionTypes.COURIER_PROFILE_UPDATED, payload: courier });
  });
  return unsubscribe;
}

export const watchAvailableCouriers = (api) => (dispatch) => {
  const unsubscribe = api.watchAvailableCouriers((result) => {
    dispatch({ type: actionTypes.AVAILABLE_COURIERS_UPDATED, payload: result });
  });
  return unsubscribe;
}