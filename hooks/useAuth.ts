import * as Linking from 'expo-linking';
import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  observeSignIn,
  getSignInEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '../store/actions/consumer';
import { getFlavor } from '../store/selectors/config';
import { ApiContext } from '../utils/context';
import useDeepLink from './useDeepLink';

export enum AuthState {
  Checking = 'checking',
  NoCredentials = 'no-credentials',
  SigningIn = 'signing-in',
  SignedIn = 'signed-in',
  InvalidCredentials = 'invalid-credentials',
}

export default function () {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch();

  // state
  const flavor = useSelector(getFlavor);
  const auth = useSelector((state) => {
    if (flavor === 'consumer') return state.consumer.auth;
    return state.courier.auth;
  });
  const [authState, setAuthState] = useState<AuthState>(AuthState.Checking);
  const [user, setUser] = useState<firebase.User | null>(null);

  // side effects
  // once
  useEffect(() => {
    dispatch(observeSignIn(api)(flavor));
  }, []);

  // whenever auth changes
  useEffect(() => {
    if (!auth) return;
    setUser(auth);
    setAuthState(AuthState.SignedIn);
  }, [auth]);

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
            setUser(await signInWithEmailLink(api)(email, link));
            setAuthState(AuthState.SignedIn);
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
