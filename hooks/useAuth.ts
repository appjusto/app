import * as Linking from 'expo-linking';
import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../screens/app/context';
import {
  observeAuthState,
  getSignInEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '../store/actions/user';
import { getUser } from '../store/selectors/user';
import useDeepLink from './useDeepLink';

export enum AuthState {
  Checking = 'checking',
  Unsigned = 'unsigned',
  SigningIn = 'signing-in',
  SignedIn = 'signed-in',
  InvalidCredentials = 'invalid-credentials',
}

export default function (): [AuthState, firebase.User | undefined | null] {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const user = useSelector(getUser);
  const [authState, setAuthState] = useState<AuthState>(AuthState.Checking);
  const deepLink = useDeepLink();
  const [checkDeeplink, setCheckDeeplink] = useState(false);

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
      setCheckDeeplink(true);
    } else {
      setAuthState(AuthState.SignedIn);
    }
  }, [user]);

  // whenever deeplink changes
  useEffect(() => {
    // deeplink is checked only if user was not logged before
    if (!checkDeeplink) return;
    // undefined means we're still checkin for the deeplink
    if (deepLink === undefined) return;
    // null means that no deeplink was found
    if (deepLink === null) {
      setAuthState(AuthState.Unsigned);
      return;
    }
    const link = deepLink.queryParams?.link ?? '';
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
        await signInWithEmailLink(api)(email, link);
        const continueUrl = Linking.parse(link).queryParams?.continueUrl;
        console.log('continueUrl:', continueUrl);
      } catch (e) {
        setAuthState(AuthState.InvalidCredentials);
      }
    });
  }, [checkDeeplink, deepLink]);

  return [authState, user];
}
