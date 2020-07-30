import * as Linking from 'expo-linking';
import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  observeAuthState,
  getSignInEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '../store/actions/user';
import { getUser } from '../store/selectors/user';
import { ApiContext } from '../utils/context';
import useDeepLink from './useDeepLink';

export enum AuthState {
  Checking = 'checking',
  Unsigned = 'unsigned',
  SigningIn = 'signing-in',
  SignedIn = 'signed-in',
  InvalidCredentials = 'invalid-credentials',
}

export default function () {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch();

  // state
  const user = useSelector(getUser);
  const [authState, setAuthState] = useState<AuthState>(AuthState.Checking);

  // side effects
  // once
  useEffect(() => {
    const unsubscribe = dispatch(observeAuthState(api));
    return () => {
      console.log('unsubscribe');
      console.log(unsubscribe);
      unsubscribe(); // dispatch is probably returning wrong type here.
    };
  }, []);

  // whenever auth changes
  useEffect(() => {
    if (user) setAuthState(AuthState.SignedIn);
    else if (authState === AuthState.SignedIn) {
      setAuthState(AuthState.Unsigned);
    }
  }, [user]);

  // whenever deeplink changes
  const deepLink = useDeepLink();
  useEffect(() => {
    if (!deepLink) return;
    const link = deepLink?.queryParams?.link ?? '';
    if (isSignInWithEmailLink(api)(link)) {
      setAuthState(AuthState.SigningIn);
      getSignInEmail().then(async (email) => {
        if (!email) {
          setAuthState(AuthState.InvalidCredentials);
        } else {
          try {
            await signInWithEmailLink(api)(email, link);
            const continueUrl = Linking.parse(link).queryParams?.continueUrl;
            console.log('continueUrl:', continueUrl);
          } catch (e) {
            setAuthState(AuthState.InvalidCredentials);
          }
        }
      });
    } else {
      setAuthState(AuthState.InvalidCredentials);
    }
  }, [deepLink]);

  return [authState, user];
}
