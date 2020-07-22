import Constants from 'expo-constants';
import { GOOGLE_MAPS_API_KEY, FIREBASE_EMULATOR, FIREBASE_REGION, FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_NAME, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from 'react-native-dotenv';

export const getExtra = () => Constants.manifest.extra;

export const getAppFlavor = () => {
  const { releaseChannel } = Constants.manifest;

  if (releaseChannel) {
    if (releaseChannel.indexOf('consumer') === 0) return 'consumer';
    if (releaseChannel.indexOf('courier') === 0) return 'courier';
  }

  // default
  return 'admin';
}

const getFirebaseConfig = () => {
  return {
    apiKey: FIREBASE_API_KEY,
    authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${FIREBASE_DATABASE_NAME}.firebaseio.com`,
    functionsURL: `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    emulator: {
      // enabled: FIREBASE_EMULATOR === 'true',
      // enabled: true,
      enabled: false,
      databaseURL: `localhost:8080`,
      functionsURL: `http://localhost:5001/${FIREBASE_PROJECT_ID}/${FIREBASE_REGION}`,
    }
    // measurementId: null,
  }
}

export default ({ config }) => {
  const { ios, android, extra } = config;

  return {
    ...config,
    ios: {
      ...ios,
      config: {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      }
    },
    android: {
      ...android,
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY,
        }
      },
    },
    extra: {
      ...extra,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      firebase: getFirebaseConfig(),
    },
  };
};