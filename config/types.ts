import { Flavor } from 'appjusto-types';

export type Environment = 'dev' | 'staging' | 'live';

export interface Extra {
  flavor: Flavor;
  bundleIdentifier: string;
  androidPackage: string;
  firebase: FirebaseConfig;
  googleMapsApiKey: string;
  analytics: AnalyticsConfig;
  iugu: {
    accountId: string;
  };
  algolia: AlgoliaConfig;
  environment: Environment;
}

export interface AnalyticsConfig {
  segmentConsumerAndroidKey: string;
  segmentConsumeriOSKey: string;
  segmentCourierAndroidKey: string;
  segmentCourieriOSKey: string;
  sentryDNS: string;
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
  region: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  emulator: {
    enabled: boolean;
    databaseURL: string;
    functionsURL: string;
  };
  measurementId: string;
}
