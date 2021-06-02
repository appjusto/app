import firebase from 'firebase';
import { AnyAction } from 'redux';
import * as Sentry from 'sentry-expo';
import { USER_AUTH_STATE_CHANGED } from './actions';
import { UserState } from './types';

const initialState: UserState = {};

export default function (state: UserState = initialState, action: AnyAction): UserState {
  const { type, payload } = action;
  const { profile, metadata } = payload;
  switch (type) {
    case USER_AUTH_STATE_CHANGED: {
      if (!state.user && profile) {
        console.log('User logged in.');
        const user = profile as firebase.User;
        Sentry.Native.setUser({ id: user.uid, email: user.email! });
      }
      if (state.user && !profile) {
        console.log('User logged out');
        Sentry.Native.configureScope((scope) => scope.setUser(null));
      }
      return { ...state, user: profile, metadata };
    }
    default:
      return state;
  }
}
