import * as actionTypes from '../actionTypes';
import { broadcastLocation } from '../api';

export const updateLocation = (location, shouldBroadcast) => (dispatch) => {
  dispatch({ type: actionTypes.LOCATION_UPDATE, payload: location });
  if (shouldBroadcast) {
    broadcastLocation(location);
  }
};

export const setLocationBroadcast = (value) => (dispatch) => {
  dispatch({ type: actionTypes.SET_LOCATION_BROADCAST, payload: value });
};
