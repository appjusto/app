import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';

const hasDeeplink = (url: Linking.ParsedURL): boolean => {
  if (url.queryParams?.link) return true;
  return false;
};

export default function () {
  // state
  const [deepLink, setDeeplink] = useState<Linking.ParsedURL | undefined | null>(undefined);

  // side effects
  // once
  useEffect(() => {
    Linking.parseInitialURLAsync().then((value) => {
      console.log('1 parsed initial URL: ', value);
      if (hasDeeplink(value)) setDeeplink(value);
    });
    const handler: Linking.URLListener = (ev) => {
      console.log('2 url changed: ', ev.url);
      const parsedURL = Linking.parse(ev.url);
      if (hasDeeplink(parsedURL)) setDeeplink(parsedURL);
    };
    Linking.addEventListener('url', handler);
    return () => Linking.removeEventListener('url', handler);
  }, []);

  return deepLink;
}
