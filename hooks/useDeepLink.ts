import * as Linking from 'expo-linking';
import { useEffect, useState, useContext } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import { useDispatch, useStore } from 'react-redux';

import { getSignInEmail, signInWithEmailLink } from '../store/actions/consumer';
import { ApiContext } from '../utils/context';
import { Dispatch } from 'redux';

export enum DeepLinkState {
  Checking,
  NoDeeplink,
  SigningIn,
  Invalid,
}

export default function () {
  // context
  const api = useContext(ApiContext);
  // const store = useStore();
  // const useThunkDispatch = () => useDispatch<typeof store.dispatch>();
  // const dispatch = useThunkDispatch();
  const dispatch = useDispatch();

  // state
  const [result, setResult] = useState<DeepLinkState>(DeepLinkState.Checking);
  const [deepLink, setDeeplink] = useState<Linking.ParsedURL | null>(null);
  const [signInLink, setSignInLink] = useState<string | null>(null);

  // side effects
  // once
  useEffect(() => {
    Linking.parseInitialURLAsync().then((value) => {
      console.log('1 parsed initial URL: ', value);
      if (!value) setResult(DeepLinkState.NoDeeplink);
      else setDeeplink(value);
    });
    const handler: Linking.URLListener = (ev) => {
      console.log('2 url changed: ', ev.url);
      setDeeplink(Linking.parse(ev.url)); // TODO: test malformed URLs
    };
    Linking.addEventListener('url', handler);
    return () => Linking.removeEventListener('url', handler);
  }, []);

  // whenever deeplink changes
  useEffect(() => {
    console.log('3 deeplink changed: ', deepLink);
    if (deepLink?.queryParams?.link) {
      setSignInLink(deepLink.queryParams?.link);
    } else {
      setResult(DeepLinkState.NoDeeplink);
    }
  }, [deepLink]);

  // whenever signInLink changes
  useEffect(() => {
    console.log('4 signInLink changed: ', signInLink);
    if (!signInLink) {
      setResult(DeepLinkState.NoDeeplink);
    } else {
      setResult(DeepLinkState.SigningIn);
      getSignInEmail().then(async (email) => {
        if (!email) {
          setResult(DeepLinkState.Invalid);
        } else {
          try {
            const result = await dispatch(signInWithEmailLink(api)(email, signInLink));
            console.log('5 signInWithEmailLink result:');
            console.log(result);
            console.log('---');
            const continueUrl = Linking.parse(signInLink).queryParams?.continueUrl;
            console.log(continueUrl);
          } catch (e) {
            setResult(DeepLinkState.Invalid);
          }
        }
      });
    }
  }, [signInLink]);

  return result;
}
