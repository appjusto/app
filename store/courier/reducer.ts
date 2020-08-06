import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import Courier from './Courier';
import { CourierState } from './types';

const initialState: CourierState = {};

export default function (state: CourierState = initialState, action: AnyAction): CourierState {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.COURIER_PROFILE_UPDATED: {
      const courier = new Courier(Object.assign({}, state.courier?.getSource(), payload));
      return { ...state, courier };
    }
    case actionTypes.USER_LOGGED_OUT: {
      return { ...state, courier: undefined };
    }
    case actionTypes.SET_LOCATION: {
      return { ...state, location: payload.coords };
    }
    default:
      return state;
  }
}
