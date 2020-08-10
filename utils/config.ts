import Constants from 'expo-constants';

import { Flavor } from '../store/config/types';

export interface Extra {
  flavor: Flavor;
  bundleIdentifier: string;
  androidPackage: string;
  firebase: FirebaseConfig;
  googleMapsApiKey: string;
  analytics: {
    segmentAndroidKey: string;
    segmentiOSKey: string;
    sentryDNS: string;
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
