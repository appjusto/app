import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api/api';
import Courier from './types/Courier';

export const updateCourierLocation = (api: Api) => (courier: Courier, location) => (
  dispatch: Dispatch<any>
) => {
  api.courier().updateCourierLocation(courier, location);
  dispatch({ type: actionTypes.SET_LOCATION, payload: location });
};
