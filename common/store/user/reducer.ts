import firebase from 'firebase';
import { AnyAction } from 'redux';
import * as Sentry from 'sentry-expo';
import {
  CONSUMER_PROFILE_UPDATED,
  COURIER_PROFILE_UPDATED,
  USER_AUTH_STATE_CHANGED,
} from './actions';
import { UserState } from './types';

const initialState: UserState = {};

export default function (state: UserState = initialState, action: AnyAction): UserState {
  const { type, payload } = action;
  switch (type) {
    case USER_AUTH_STATE_CHANGED: {
      if (!state.user && payload) {
        console.log('User logged in.');
        const user = payload as firebase.User;
        Sentry.Native.setUser({ id: user.uid, email: user.email! });
      }
      if (state.user && !payload) {
        console.log('User logged out');
        Sentry.Native.configureScope((scope) => scope.setUser(null));
      }
      return { ...state, user: payload };
    }
    case CONSUMER_PROFILE_UPDATED: {
      return { ...state, metadata: payload.metadata };
    }
    case COURIER_PROFILE_UPDATED: {
      return { ...state, metadata: payload.metadata };
    }
    default:
      return state;
  }
}
