import { ConsumerProfile, WithId } from 'appjusto-types';
import { AnyAction } from 'redux';
import { CONSUMER_PROFILE_UPDATED, USER_LOGGED_OUT } from '../user/actions';
import { UPDATE_CURRENT_ADDRESS, UPDATE_CURRENT_LOCATION } from './actions';
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
    case UPDATE_CURRENT_LOCATION: {
      return { ...state, currentLocation: action.payload };
    }
    case UPDATE_CURRENT_ADDRESS: {
      return { ...state, currentAddress: action.payload };
    }
    default:
      return state;
  }
}
