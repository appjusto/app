// import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
// import { Platform, ToastAndroid } from 'react-native';

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

    // testing only; always commit it commented
    // setting deeplink directly to make testing easier
    // console.log(Constants.deviceName);
    // if (Constants.deviceName === 'iPhone de eliza') {
    //   setDeeplink(
    //     decodeURIComponent(
    //       'https://endless-bolt-281414.firebaseapp.com/__/auth/action?apiKey%3DAIzaSyDR7btJggR1VbwVh9U6F9AHBi9eZZT_Oh8%26mode%3DsignIn%26oobCode%3Dm6ws17VQmUiakkesMsBx7Jojimu7U2LxhF-vQFOaG4kAAAF0K7e6dg%26continueUrl%3Dhttps://deeplink.appjusto.com.br/consumer/join?something%253Delse%27%26lang%3Dpt-BR'
    //     )
    //   );
    // }
    return () => Linking.removeEventListener('url', handler);
  }, []);

  // testing only; always commit it commented
  // useEffect(() => {
  //   if (deepLink) {
  //     if (Platform.OS === 'android') {
  //       ToastAndroid.show(deepLink, ToastAndroid.LONG);
  //     }
  //   }
  // }, [deepLink]);

  return deepLink;
}
