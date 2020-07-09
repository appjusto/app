import * as actionTypes from '../actionTypes';

export const setLocation = (location) => (dispatch) => {
  dispatch({ type: actionTypes.SET_LOCATION, payload: location });
};