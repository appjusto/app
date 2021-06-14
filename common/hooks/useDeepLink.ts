import * as Linking from 'expo-linking';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/context';

export default function () {
  const dispatch = useDispatch<AppDispatch>();
  // state
  const [deeplink, setDeeplink] = React.useState<string | null>();

  // side effects
  // once
  React.useEffect(() => {
    Linking.getInitialURL().then((value) => {
      setDeeplink(value);
    });
    const handler: Linking.URLListener = (ev) => {
      setDeeplink(ev.url);
    };
    Linking.addEventListener('url', handler);

    return () => Linking.removeEventListener('url', handler);
  }, [dispatch]);

  return deeplink;
}
