import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { CourierState, Courier } from './types';

const initialState: CourierState = {
  availableCouriers: [],
};

export default function (state: CourierState = initialState, action: AnyAction): CourierState {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.COURIER_PROFILE_UPDATED: {
      return { ...state, courier: { ...state.courier, ...payload } };
    }
    case actionTypes.USER_LOGGED_OUT: {
      return { ...state, courier: undefined };
    }
    case actionTypes.SET_LOCATION: {
      return { ...state, courier: { ...state.courier, location: payload.coords } as Courier };
    }
    case actionTypes.AVAILABLE_COURIERS_UPDATED: {
      return { ...state, availableCouriers: payload };
    }
    default:
      return state;
  }
}
