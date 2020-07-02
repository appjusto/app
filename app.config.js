import Constants from 'expo-constants';
import { APP_FLAVOR, FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_NAME, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from 'react-native-dotenv';

export const getExtra = () => Constants.manifest.extra;

export const getAppFlavor = () => {
  if (APP_FLAVOR) return APP_FLAVOR;

  const { releaseChannel } = Constants.manifest;
  if (!releaseChannel) return 'admin';
  if (releaseChannel.indexOf('courier') === 0) return 'courier';
  if (releaseChannel.indexOf('consumer') === 0) return 'consumer';
}

export default ({ config }) => {
  const { extra } = config;
  return {
    ...config,
    extra: {
      ...extra,
      firebase: {
        apiKey: FIREBASE_API_KEY,
        authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
        databaseURL: `https://${FIREBASE_DATABASE_NAME}.firebaseio.com`,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
        // measurementId: null,
      },
    },
  };
};