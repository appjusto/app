import { AnyAction } from 'redux';

import { COURIER_PROFILE_UPDATED, USER_LOGGED_OUT } from '../user/actions';
import { UPDATE_BANKS } from './actions';
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
    case UPDATE_BANKS: {
      return { ...state, banks: payload };
    }
    case USER_LOGGED_OUT: {
      return { ...state, courier: undefined };
    }
    default:
      return state;
  }
}
