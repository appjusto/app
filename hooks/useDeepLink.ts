import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Platform, ToastAndroid } from 'react-native';

export default function () {
  // state
  const [deepLink, setDeeplink] = useState<string | undefined | null>(undefined);

  // side effects
  // once
  useEffect(() => {
    Linking.getInitialURL().then((value) => {
      setDeeplink(value);
    });
    const handler: Linking.URLListener = (ev) => {
      setDeeplink(ev.url);
    };
    Linking.addEventListener('url', handler);
    return () => Linking.removeEventListener('url', handler);
  }, []);

  // debug only
  useEffect(() => {
    if (deepLink) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(deepLink, ToastAndroid.LONG);
      }
    }
  }, [deepLink]);

  return deepLink;
}
