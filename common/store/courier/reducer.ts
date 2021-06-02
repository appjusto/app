import { CourierProfile, WithId } from '@appjusto/types';
import { AnyAction } from 'redux';
import { COURIER_PROFILE_UPDATED, USER_AUTH_STATE_CHANGED } from '../user/actions';
import { CourierState } from './types';

const initialState: CourierState = {};

export default function (state: CourierState = initialState, action: AnyAction): CourierState {
  const { type, payload } = action;
  switch (type) {
    case COURIER_PROFILE_UPDATED: {
      const courier = Object.assign({}, state.courier, payload) as WithId<CourierProfile>;
      return { ...state, courier };
    }
    case USER_AUTH_STATE_CHANGED: {
      if (!payload) return { ...state, courier: undefined };
      return state;
    }
    default:
      return state;
  }
}
