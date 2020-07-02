import * as actionTypes from '../actionTypes';
import { broadcastLocation } from '../api';

export const updateLocation = (location, shouldBroadcast) => (dispatch) => {
  dispatch({ type: actionTypes.LOCATION_UPDATE, payload: location });
  if (shouldBroadcast) {
    broadcastLocation(location);
  }
};

