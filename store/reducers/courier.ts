import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { CourierState, Courier } from '../types/courier';

const initialState: CourierState = {
  availableCouriers: [],
};

export default function (state: CourierState = initialState, action: AnyAction): CourierState {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_COURIER_PROFILE:
    case actionTypes.COURIER_PROFILE_UPDATED: {
      return { ...state, courier: { ...state.courier, ...payload } };
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
