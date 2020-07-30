import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { UserState } from '../types/user';

const initialState: UserState = {};

export default function (state: UserState = initialState, action: AnyAction): UserState {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.USER_LOGGED_IN: {
      return { ...state, user: payload };
    }
    case actionTypes.USER_LOGGED_OUT: {
      return { ...state, user: null };
    }
    default:
      return state;
  }
}
