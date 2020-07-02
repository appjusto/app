import * as actionTypes from '../actionTypes';

export const courierSetWorking = (value) => (dispatch) => {
  dispatch({ type: actionTypes.COURIER_SET_WORKING, payload: value });
};