import { WithId, CourierProfile } from 'appjusto-types';
import { AnyAction } from 'redux';

import { COURIER_PROFILE_UPDATED, USER_LOGGED_OUT } from '../user/actions';
import { UPDATE_BANKS } from './actions';
import { CourierState } from './types';

const initialState: CourierState = {};

export default function (state: CourierState = initialState, action: AnyAction): CourierState {
  const { type, payload } = action;
  switch (type) {
    case COURIER_PROFILE_UPDATED: {
      const courier = Object.assign({}, state.courier, payload) as WithId<CourierProfile>;
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
