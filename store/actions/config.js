import * as actionTypes from '../actionTypes';

export const setFlavor = (value) => (dispatch) => {
  dispatch({ type: actionTypes.CONFIG_SET_FLAVOR, payload: value });
};