import { CourierProfile, WithId } from 'appjusto-types';
import { AnyAction } from 'redux';
import { COURIER_PROFILE_UPDATED, USER_LOGGED_OUT } from '../user/actions';
import { UPDATE_SHOWN_LOCATION_DISCLOSURE } from './actions';
import { CourierState } from './types';

const initialState: CourierState = { shownLocationDisclosure: false };

export default function (state: CourierState = initialState, action: AnyAction): CourierState {
  const { type, payload } = action;
  switch (type) {
    case COURIER_PROFILE_UPDATED: {
      const courier = Object.assign({}, state.courier, payload) as WithId<CourierProfile>;
      return { ...state, courier };
    }
    case USER_LOGGED_OUT: {
      return { ...state, courier: undefined };
    }
    case UPDATE_SHOWN_LOCATION_DISCLOSURE: {
      return { ...state, shownLocationDisclosure: payload };
    }
    default:
      return state;
  }
}
