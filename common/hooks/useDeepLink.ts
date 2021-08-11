import * as Linking from 'expo-linking';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/context';
import { track } from '../store/api/track';

export default function () {
  const dispatch = useDispatch<AppDispatch>();
  // state
  const [deeplink, setDeeplink] = React.useState<string | null>();

  // side effects
  // once
  React.useEffect(() => {
    Linking.getInitialURL().then((value) => {
      track('Initial Deeplink', {
        url: value,
      });
      setDeeplink(value);
    });
    const handler: Linking.URLListener = (ev) => {
      setDeeplink(ev.url);
      track('Deeplink changed', {
        url: ev.url,
      });
    };
    Linking.addEventListener('url', handler);

    return () => Linking.removeEventListener('url', handler);
  }, [dispatch]);

  return deeplink;
}
