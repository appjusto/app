import { Flavor } from 'appjusto-types/platform';
import Constants from 'expo-constants';

export interface Extra {
  flavor: Flavor;
  bundleIdentifier: string;
  androidPackage: string;
  firebase: FirebaseConfig;
  googleApiKeys: {
    android: string;
    ios: string;
  };
  analytics: {
    segmentAndroidKey: string;
    segmentiOSKey: string;
    sentryDNS: string;
  };
  iugu: {
    accountId: string;
  };
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  functionsURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  emulator: {
    enabled: boolean;
    databaseURL: string;
    functionsURL: string;
  };
}

export const getExtra = (): Extra => Constants.manifest.extra as Extra;
