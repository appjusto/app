import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../app/context';
import {
  getSignInEmail,
  isSignInWithEmailLink,
  observeAuthState,
  signInWithEmailLink,
} from '../store/user/actions';
import { getUser } from '../store/user/selectors';
import useDeepLink from './useDeepLink';

export enum AuthState {
  CheckingPreviousSession = 'checking-previous-sesssion',
  CheckingDeeplink = 'checking-deeplink',
  Unsigned = 'unsigned',
  SigningIn = 'signing-in',
  SignedIn = 'signed-in',
  InvalidCredentials = 'invalid-credentials',
}

const extractAuthLink = (link: string) => {
  const authLink = link.split('link=').find((_, i, a) => i === a.length - 1);
  Sentry.Native.captureMessage('Deeplink', {
    extra: {
      link,
      authLink: authLink ? decodeURIComponent(authLink) : null,
    },
  });
  if (authLink) return decodeURIComponent(authLink);
  return null;
};

export default function (): [AuthState, firebase.User | undefined | null] {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const user = useSelector(getUser);
  const [authState, setAuthState] = useState<AuthState>(AuthState.CheckingPreviousSession);
  const deepLink = useDeepLink();

  // side effects
  // subscribe once to be notified whenever the user changes (capture by the next effect)
  useEffect(() => {
    const unsubscribe = dispatch(observeAuthState(api));
    return unsubscribe;
  }, []);

  // whenever auth changes
  useEffect(() => {
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
  useEffect(() => {
    if (authState === AuthState.InvalidCredentials || authState === AuthState.Unsigned) {
      setAuthState(AuthState.CheckingDeeplink);
    }
  }, [deepLink]);

  useEffect(() => {
    if (authState !== AuthState.CheckingDeeplink) return;
    // undefined means useDeeplink hasnt finished yet
    if (deepLink === undefined) return;
    // null means there's no deeplink
    if (deepLink === null) {
      setAuthState(AuthState.Unsigned);
      return;
    }
    const link = extractAuthLink(deepLink);
    if (link === null) {
      setAuthState(AuthState.Unsigned);
      return;
    }
    if (!isSignInWithEmailLink(api)(link)) {
      setAuthState(AuthState.InvalidCredentials);
      return;
    }
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
        setAuthState(AuthState.InvalidCredentials);
      }
    });
  }, [deepLink, authState]);

  return [authState, user];
}
