import * as Linking from 'expo-linking';
import React from 'react';
import { useSelector } from 'react-redux';
import { track } from '../store/api/track';
import { getExtra } from '../utils/config';

export const useDeeplink = () => {
  // redux
  const { environment } = useSelector(getExtra);
  // state
  const [deeplink, setDeeplink] = React.useState<string | null>();
  // side effects
  // once
  React.useEffect(() => {
    Linking.getInitialURL().then((value) => {
      if (environment !== 'live') {
        track('Initial Deeplink', {
          url: value,
        });
      }
      setDeeplink(value);
    });
    const handler: Linking.URLListener = (ev) => {
      setDeeplink(ev.url);
      if (environment !== 'live') {
        track('Deeplink changed', {
          url: ev.url,
        });
      }
    };
    Linking.addEventListener('url', handler);

    return () => Linking.removeEventListener('url', handler);
  }, []);

  return deeplink;
};
