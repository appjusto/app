import { AnyAction } from 'redux';

import { USER_LOGGED_IN, USER_LOGGED_OUT } from './actions';
import { UserState } from './types';

const initialState: UserState = {};

export default function (state: UserState = initialState, action: AnyAction): UserState {
  const { type, payload } = action;
  switch (type) {
    case USER_LOGGED_IN: {
      return { ...state, user: payload };
    }
    case USER_LOGGED_OUT: {
      return { ...state, user: null };
    }
    default:
      return state;
  }
}
