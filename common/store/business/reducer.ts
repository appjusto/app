import { Business, WithId } from '@appjusto/types';
import { AnyAction } from 'redux';
import { BUSINESS_PROFILE_UPDATED, USER_AUTH_STATE_CHANGED } from '../user/actions';
import { BusinessState } from './types';

const initialState: BusinessState = {};

export default function (state: BusinessState = initialState, action: AnyAction): BusinessState {
  const { type, payload } = action;
  switch (type) {
    case BUSINESS_PROFILE_UPDATED: {
      const business = Object.assign({}, state.business, payload?.profile) as WithId<Business>;
      return { ...state, business };
    }
    case USER_AUTH_STATE_CHANGED: {
      if (!payload) return { ...state, business: undefined };
      return state;
    }
    default:
      return state;
  }
}
