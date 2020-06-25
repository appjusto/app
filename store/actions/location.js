import * as actionTypes from '../actionTypes';

export const updateLocation = (location) => (dispatch) => {
  dispatch({ type: actionTypes.LOCATION_UPDATE, payload: location });
};
