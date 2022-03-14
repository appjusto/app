import { AnyAction } from 'redux';
import { USER_AUTH_STATE_CHANGED } from '../user/actions';
import { BusinessState } from './types';

const initialState: BusinessState = {};

export default function (state: BusinessState = initialState, action: AnyAction): BusinessState {
  const { type, payload } = action;
  switch (type) {
    case USER_AUTH_STATE_CHANGED: {
      if (!payload) return { ...state, business: undefined };
      return state;
    }
    default:
      return state;
  }
}
