import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import Courier from './types/Courier';

export const SET_LOCATION = 'SET_LOCATION';

export const updateCourierLocation = (api: Api) => (courier: Courier, location) => (
  dispatch: AppDispatch
) => {
  api.courier().updateCourierLocation(courier, location);
  dispatch({ type: SET_LOCATION, payload: location });
};
