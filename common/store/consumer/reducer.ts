import { ConsumerProfile, WithId } from '@appjusto/types';
import { AnyAction } from 'redux';
import { CONSUMER_PROFILE_UPDATED, USER_AUTH_STATE_CHANGED } from '../user/actions';
import {
  UPDATE_CURRENT_LOCATION,
  UPDATE_CURRENT_PLACE,
  UPDATE_SEARCH_FILTERS,
  UPDATE_SEARCH_KIND,
  UPDATE_SEARCH_ORDER,
} from './actions';
import { ConsumerState } from './types';

const initialState: ConsumerState = {
  searchKind: 'restaurant',
  searchOrder: 'distance',
  searchFilters: [],
};

export default function (state: ConsumerState = initialState, action: AnyAction): ConsumerState {
  const { type, payload } = action;
  const { profile } = payload;
  switch (type) {
    case CONSUMER_PROFILE_UPDATED: {
      const consumer = Object.assign({}, state.consumer, profile) as WithId<ConsumerProfile>;
      return { ...state, consumer };
    }
    case USER_AUTH_STATE_CHANGED: {
      if (!profile) return { ...state, consumer: undefined };
      return state;
    }
    case UPDATE_CURRENT_LOCATION: {
      return { ...state, currentLocation: action.payload };
    }
    case UPDATE_CURRENT_PLACE: {
      return { ...state, currentPlace: action.payload };
    }
    case UPDATE_SEARCH_KIND: {
      return { ...state, searchKind: action.payload };
    }
    case UPDATE_SEARCH_ORDER: {
      return { ...state, searchOrder: action.payload };
    }
    case UPDATE_SEARCH_FILTERS: {
      return { ...state, searchFilters: action.payload };
    }
    default:
      return state;
  }
}
