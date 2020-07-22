import * as actionTypes from '../actionTypes';
import { AnyAction } from 'redux';
import { CourierState, CourierStatus } from '../types/courier';

const initialState: CourierState = {
  courier: {
    id: 'courier-1',
    status: CourierStatus.Unavailable,
  },
  order: null,
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
      return { ...state, courier: { ...state.courier, location: payload.coords } };
    }    
    case actionTypes.AVAILABLE_COURIERS_UPDATED: {
      return { ...state, availableCouriers: payload };
    }
    default:
      return state;
  }
  
}
