import { ConsumerProfile, WithId } from 'appjusto-types';
import { AnyAction } from 'redux';

import { USER_LOGGED_OUT, CONSUMER_PROFILE_UPDATED } from '../user/actions';
import { ConsumerState } from './types';

const initialState: ConsumerState = {};

export default function (state: ConsumerState = initialState, action: AnyAction): ConsumerState {
  const { type, payload } = action;
  switch (type) {
    case CONSUMER_PROFILE_UPDATED: {
      const consumer = Object.assign({}, state.consumer, payload) as WithId<ConsumerProfile>;
      return { ...state, consumer };
    }
    case USER_LOGGED_OUT: {
      return { ...state, consumer: undefined };
    }
    default:
      return state;
  }
}
