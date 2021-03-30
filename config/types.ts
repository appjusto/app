import { Flavor } from 'appjusto-types';

export type Environment = 'local' | 'dev' | 'staging' | 'live';

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
  algolia: AlgoliaConfig;
  environment: Environment;
}

export interface AlgoliaConfig {
  appId: string;
  apiKey: string;
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
