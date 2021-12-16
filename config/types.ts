import { Environment, Flavor } from '@appjusto/types';

export interface Extra {
  flavor: Flavor;
  bundleIdentifier: string;
  androidPackage: string;
  firebase: FirebaseConfig;
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
  apiKeyAndroid: string;
  apiKeyiOS: string;
  authDomain: string;
  region: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  emulator: {
    enabled: boolean;
    host?: string;
  };
  measurementId: string;
}
