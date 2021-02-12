import 'dotenv/config';

const {
  GOOGLE_ANDROID_API_KEY,
  GOOGLE_IOS_API_KEY,
  GOOGLE_MAPS_API_KEY,
  FIREBASE_REGION,
  FIREBASE_PROJECT_ID,
  FIREBASE_DATABASE_NAME,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_EMULATOR_HOST,
  SEGMENT_ANDROID_KEY,
  SEGMENT_IOS_KEY,
  SENTRY_DSN,
  SENTRY_AUTH_TOKEN,
  IUGU_ACCOUNT_ID,
  ALGOLIA_APPID,
  ALGOLIA_APIKEY,
  ALGOLIA_ENV,
} = process.env;

export default () => {
  const version = '0.2.0';
  const versionCode = 8;
  const flavor = process.env.FLAVOR;
  const appId = `com.appjusto.${flavor}`;
  const icon = (platform) => `./assets/icon-${flavor}-${platform}.png`;
  const permissions = {
    consumer: undefined,
    courier: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'VIBRATE',
      'RECORD_AUDIO',
    ],
  };
  const extra = {
    flavor,
    bundleIdentifier: appId,
    androidPackage: appId,
    googleApiKeys: {
      android: GOOGLE_ANDROID_API_KEY,
      ios: GOOGLE_IOS_API_KEY,
    },
    firebase: {
      apiKey: null, // it will be filled in runtime according with user's OS
      authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
      databaseURL: `https://${FIREBASE_DATABASE_NAME}.firebaseio.com`,
      functionsURL: `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID,
      emulator: {
        enabled: process.env.FIREBASE_EMULATOR === 'true',
        databaseURL: `${FIREBASE_EMULATOR_HOST}:8080`,
        functionsURL: `http://${FIREBASE_EMULATOR_HOST}:5001`,
      },
      // measurementId: null,
    },
    analytics: {
      segmentAndroidKey: SEGMENT_ANDROID_KEY,
      segmentiOSKey: SEGMENT_IOS_KEY,
      sentryDNS: SENTRY_DSN,
    },
    iugu: {
      accountId: IUGU_ACCOUNT_ID,
    },
    algolia: {
      appId: ALGOLIA_APPID,
      apiKey: ALGOLIA_APIKEY,
      env: ALGOLIA_ENV,
    },
  };
  return {
    expo: {
      name: (flavor === 'consumer' && 'AppJusto') || (flavor === 'courier' && 'Parceiro Justo'),
      slug: `app-justo-${flavor}`,
      scheme: 'appjusto',
      platforms: ['ios', 'android'],
      version,
      orientation: 'portrait',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'cover',
        backgroundColor: '#78e08f',
      },
      notification: {
        icon: './assets/notification-icon.png',
      },
      updates: {
        fallbackToCacheTimeout: 0,
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        bundleIdentifier: appId,
        buildNumber: `${versionCode}`,
        icon: icon('ios'),
        supportsTablet: true,
        infoPlist: {
          UIBackgroundModes: ['location'],
          NSLocationWhenInUseUsageDescription: 'Saber a localização do entregador',
          NSLocationAlwaysAndWhenInUseUsageDescription: 'Saber a localização do entregador',
          NSLocationAlwaysUsageDescription: 'Saber a localização do entregador',
        },
        associatedDomains: ['applinks:deeplink.appjusto.com.br'],
        config: {
          googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        },
      },
      android: {
        package: appId,
        versionCode,
        adaptiveIcon: {
          foregroundImage: icon('android'),
          backgroundColor: flavor === 'consumer' ? '#78E08F' : '#FFE493',
        },
        googleServicesFile: './google-services.json',
        useNextNotificationsApi: true,
        softwareKeyboardLayoutMode: 'pan',
        permissions: permissions[flavor],
        intentFilters: [
          {
            action: 'VIEW',
            autoVerify: false,
            data: [
              {
                scheme: 'https',
                host: 'deeplink.appjusto.com.br',
                pathPrefix: `/${flavor}`,
              },
            ],
            category: ['BROWSABLE', 'DEFAULT'],
          },
        ],
        config: {
          googleMaps: {
            apiKey: GOOGLE_MAPS_API_KEY,
          },
        },
      },
      hooks: {
        postPublish: [
          {
            file: 'sentry-expo/upload-sourcemaps',
            config: {
              organization: 'app-justo',
              project: 'app-justo',
              authToken: SENTRY_AUTH_TOKEN,
            },
          },
        ],
      },
      extra,
    },
  };
};
