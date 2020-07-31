import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { ConsumerState } from '../types/consumer';

const initialState: ConsumerState = {};

export default function (state: ConsumerState = initialState, action: AnyAction): ConsumerState {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.CONSUMER_PROFILE_UPDATED: {
      console.log(action);
      return { ...state, consumer: { ...state.consumer, ...payload } };
    }
    default:
      return state;
  }
}
