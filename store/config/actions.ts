import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';

export const setFlavor = (value: string) => (dispatch: Dispatch<any>) => {
  dispatch({ type: actionTypes.CONFIG_SET_FLAVOR, payload: value });
};
