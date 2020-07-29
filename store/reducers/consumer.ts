import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { ConsumerState } from '../types/consumer';

const initialState: ConsumerState = {};

export default function (state: ConsumerState = initialState, action: AnyAction): ConsumerState {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.USER_LOGGED_IN: {
      if (payload.flavor === 'consumer') {
        return { ...state, auth: payload.user };
      }
      return state;
    }
    case actionTypes.SET_LOCATION: {
      return { ...state, consumer: { ...state.consumer!, location: payload.coords } };
    }
    default:
      return state;
  }
}
