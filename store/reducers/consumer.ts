import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { ConsumerState } from '../types/consumer';

const initialState: ConsumerState = {};

export default function (state: ConsumerState = initialState, action: AnyAction) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_LOCATION: {
      return { ...state, courier: { ...state.consumer, location: payload.coords } };
    }
    default:
      return state;
  }
}
