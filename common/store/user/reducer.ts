import { User } from 'firebase/auth';
import { AnyAction } from 'redux';
import * as Sentry from 'sentry-expo';
import { USER_AUTH_STATE_CHANGED } from './actions';
import { UserState } from './types';

const initialState: UserState = {};

export default function (state: UserState = initialState, action: AnyAction): UserState {
  const { type, payload } = action;
  switch (type) {
    case USER_AUTH_STATE_CHANGED: {
      if (!state.user && payload) {
        console.log('User logged in.');
        const user = payload as User;
        Sentry.Native.setUser({ id: user.uid, email: user.email! });
      }
      if (state.user && !payload) {
        console.log('User logged out');
        Sentry.Native.configureScope((scope) => scope.setUser(null));
      }
      return { ...state, user: payload };
    }
    default:
      return state;
  }
}
