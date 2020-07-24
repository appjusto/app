import Constants from 'expo-constants';

export interface Extra {
  flavor: string;
  bundleIdentifier: string;
  androidPackage: string;
  firebase: FirebaseConfig;
  googleMapsApiKey: string;
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
