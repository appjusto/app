import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';

export const showToast = (message: string, type: string = 'success') => (
  dispatch: Dispatch<any>
) => {
  dispatch({ type: actionTypes.SHOW_TOAST, payload: { message, type } });
};

export const hideToast = () => (dispatch: Dispatch<any>) => {
  dispatch({ type: actionTypes.HIDE_TOAST });
};
