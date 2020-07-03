import * as actionTypes from '../actionTypes';

export const setWorking = (value) => (dispatch) => {
  dispatch({ type: actionTypes.COURIER_SET_WORKING, payload: value });
};

export const updateCourierLocation = (api) => (courier, location, shouldBroadcast) => (dispatch) => {
  dispatch({ type: actionTypes.COURIER_UPDATE_LOCATION, payload: location });
  if (shouldBroadcast) {
    api.broadcastCourierLocation(courier, location);
  }
};

export const fetchVisibleCouriers = (api) => async (dispatch) => {
  const couriers = await api.fetchVisibleCouriers();

  dispatch({ type: actionTypes.COURIER_UPDATE_VISIBLE_COURIERS, payload: couriers });
}