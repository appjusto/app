import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { ConsumerState } from './types';

const initialState: ConsumerState = {};

export default function (state: ConsumerState = initialState, action: AnyAction): ConsumerState {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.CONSUMER_PROFILE_UPDATED: {
      return { ...state, consumer: { ...state.consumer, ...payload } };
    }
    case actionTypes.USER_LOGGED_OUT: {
      return { ...state, consumer: undefined };
    }
    default:
      return state;
  }
}
