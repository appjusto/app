import { useURL } from 'expo-linking';
import firebase from 'firebase';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../app/context';
import { track } from '../store/api/track';
import {
  getSignInEmail,
  isSignInWithEmailLink,
  observeAuthState,
  signInWithEmailLink,
} from '../store/user/actions';
import { getUser } from '../store/user/selectors';

export enum AuthState {
  CheckingPreviousSession = 'checking-previous-sesssion',
  CheckingDeeplink = 'checking-deeplink',
  Unsigned = 'unsigned',
  SigningIn = 'signing-in',
  SignedIn = 'signed-in',
  InvalidCredentials = 'invalid-credentials',
}

const extractAuthLink = (link: string) => {
  if (!link) return null;
  const authLink = link.split('link=').find((_, i, a) => i === a.length - 1)!;
  return decodeURIComponent(authLink);
};

export const useAuth = (): [AuthState, firebase.User | undefined | null] => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const user = useSelector(getUser);
  const [authState, setAuthState] = React.useState<AuthState>(AuthState.CheckingPreviousSession);
  const deeplink = useURL();

  // side effects
  // subscribe once to be notified whenever the user changes (capture by the next effect)
  React.useEffect(() => {
    return dispatch(observeAuthState(api));
  }, [api, dispatch]);

  // whenever auth changes
  React.useEffect(() => {
    // undefined means we're still checking; nothing to be done in this case
    if (user === undefined) return;
    // null means that we've already checked and no user was previously stored
    if (user === null) {
      setAuthState(AuthState.CheckingDeeplink);
    } else {
      setAuthState(AuthState.SignedIn);
    }
  }, [user]);

  // check deeplink again
  React.useEffect(() => {
    setAuthState((state) => {
      if (state === AuthState.InvalidCredentials || state === AuthState.Unsigned) {
        return AuthState.CheckingDeeplink;
      }
      return state;
    });
  }, [deeplink]);

  React.useEffect(() => {
    if (authState !== AuthState.CheckingDeeplink) return;
    // undefined means useDeeplink hasnt finished yet
    if (deeplink === undefined) return;
    // null means there's no deeplink
    track('Deeplink changed', {
      deeplink,
    });
    if (deeplink === null) {
      setAuthState(AuthState.Unsigned);
      return;
    }
    const link = extractAuthLink(deeplink);

    if (link === null || !isSignInWithEmailLink(api)(link)) {
      setAuthState(AuthState.Unsigned);
      return;
    }
    // if (!isSignInWithEmailLink(api)(link)) {
    //   setAuthState(AuthState.InvalidCredentials);
    //   return;
    // }
    setAuthState(AuthState.SigningIn);
    getSignInEmail().then(async (email) => {
      if (!email) {
        setAuthState(AuthState.InvalidCredentials);
        return;
      }
      try {
        await signInWithEmailLink(api)(email, link!);
        // const continueUrl = Linking.parse(link).queryParams?.continueUrl;
      } catch (e) {
        Sentry.Native.captureException(e);
        setAuthState(AuthState.InvalidCredentials);
      }
    });
  }, [deeplink, authState, api]);

  return [authState, user];
};
