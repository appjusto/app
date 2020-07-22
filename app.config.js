import Constants from 'expo-constants';
import { GOOGLE_MAPS_API_KEY, FIREBASE_REGION, FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_NAME, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from 'react-native-dotenv';

export const getExtra = () => Constants.manifest.extra;

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
      enabled: process.env.FIREBASE_EMULATOR === 'true',
      databaseURL: `localhost:8080`,
      functionsURL: `http://localhost:5001/${FIREBASE_PROJECT_ID}/${FIREBASE_REGION}`,
    }
    // measurementId: null,
  }
}

export default ({ config }) => {
  const { slug, name, ios, android, extra } = config;
  const flavor = process.env.FLAVOR || 'admin';
  const flavorName = (flavor === 'consumer' && 'Cliente') || (flavor === 'courier' && 'Entregador') || 'Admin'

  return {
    ...config,
    slug: `${slug}-${flavor}`,
    name: flavorName,
    ios: {
      ...ios,
      bundleIdentifier: `${ios.bundleIdentifier}.${flavor}`,
      config: {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      }
    },
    android: {
      ...android,
      package: `${android.package}.${flavor}`,
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY,
        }
      },
    },
    extra: {
      ...extra,
      flavor,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      firebase: getFirebaseConfig(),
    },
  };
};