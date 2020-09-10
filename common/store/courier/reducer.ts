import { AnyAction } from 'redux';

import {
  COURIER_PROFILE_UPDATED,
  COURIER_PROFILE_INFO_UPDATED,
  USER_LOGGED_OUT,
} from '../user/actions';
import { SET_LOCATION, UPDATE_BANKS } from './actions';
import { CourierState } from './types';
import Courier from './types/Courier';

const initialState: CourierState = {};

export default function (state: CourierState = initialState, action: AnyAction): CourierState {
  const { type, payload } = action;
  switch (type) {
    case COURIER_PROFILE_UPDATED: {
      const courier = new Courier(Object.assign({}, state.courier?.getSource(), payload));
      return { ...state, courier };
    }
    case COURIER_PROFILE_INFO_UPDATED: {
      const info = Object.assign({}, state.courier?.info, payload);
      const courier = new Courier(Object.assign({}, state.courier?.getSource(), { info }));
      return { ...state, courier };
    }
    case UPDATE_BANKS: {
      return { ...state, banks: payload };
    }
    case USER_LOGGED_OUT: {
      return { ...state, courier: undefined };
    }
    case SET_LOCATION: {
      return { ...state, location: payload.coords };
    }
    default:
      return state;
  }
}
