import { Flavor } from '@appjusto/types';
import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';
import { Environment, Extra } from './config/types';
import { version, versionCode } from './version.json';
const {
  FLAVOR,
  ENVIRONMENT,
  FIREBASE_API_KEY_ANDROID,
  FIREBASE_API_KEY_IOS,
  FIREBASE_REGION,
  FIREBASE_PROJECT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_CONSUMER_APP_ID,
  FIREBASE_CONSUMER_MEASUREMENT_ID,
  FIREBASE_COURIER_APP_ID,
  FIREBASE_COURIER_MEASUREMENT_ID,
  FIREBASE_EMULATOR_HOST,
  GOOGLE_MAPS_API_KEY,
  SEGMENT_CONSUMER_IOS_KEY,
  SEGMENT_CONSUMER_ANDROID_KEY,
  SEGMENT_COURIER_IOS_KEY,
  SEGMENT_COURIER_ANDROID_KEY,
  SENTRY_DSN,
  IUGU_ACCOUNT_ID,
  ALGOLIA_APPID,
  ALGOLIA_APIKEY,
  SENTRY_AUTH_TOKEN,
} = process.env;

const flavor: Flavor = FLAVOR as Flavor;
const environment: Environment = ENVIRONMENT as Environment;

const getBaseDomain = (environment: Environment) =>
  `${environment === 'live' ? '' : `${environment}.`}appjusto.com.br`;

const getDeeplinkDomain = (environment: Environment) =>
  `${environment.charAt(0)}.deeplink.appjusto.com.br`;

const getFallbackDomain = (environment: Environment) =>
  `${environment === 'live' ? '' : `${environment}.`}login.appjusto.com.br`;

export default (context: ConfigContext): ExpoConfig => {
  const config: ExpoConfig = {
    name: name(),
    slug: slug(),
    scheme: scheme(),
    privacy: 'hidden',
    platforms: ['ios', 'android'],
    version,
    orientation: 'portrait',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#78e08f',
    },
    updates: {
      fallbackToCacheTimeout: 1000 * (flavor === 'courier' ? 120 : 10),
    },
    assetBundlePatterns: ['**/*'],
    ios: ios(),
    android: android(),
    extra: extra(),
    hooks: hooks(),
    plugins:
      flavor === 'courier'
        ? [
            [
              'expo-notifications',
              {
                icon: './assets/notification-icon.png',
                sounds: ['./assets/sounds/order_request.wav'],
                mode: environment === 'live' ? 'production' : 'development',
              },
            ],
          ]
        : undefined,
  };
  // console.log(config);
  return config;
};

const name = () => {
  let name = 'AppJusto';
  if (flavor === 'courier') name = 'AppJusto Entregador';
  if (environment === 'dev') return `(D) ${name}`;
  else if (environment === 'staging') return `(S) ${name}`;
  return name;
};

const slug = () => {
  const slug = `app-justo-${flavor}`;
  if (environment !== 'live') return `${slug}-${environment}`;
  return slug;
};

const scheme = () => {
  const scheme = flavor === 'consumer' ? 'appjusto' : 'appjustocourier';
  if (environment !== 'live') return `${scheme}${environment}`;
  return scheme;
};

const appBundlePackage = () => {
  return `br.com.appjusto.${flavor}.${environment}`;
};

const icon = (platform: 'ios' | 'android') => {
  if (environment === 'live') return `./assets/icon-${flavor}-${platform}.png`;
  return `./assets/icon-${flavor}-${environment}.png`;
};

const ios = () => ({
  bundleIdentifier: appBundlePackage(),
  buildNumber: `${versionCode}`,
  icon: icon('ios'),
  supportsTablet: false,
  infoPlist:
    flavor === 'consumer'
      ? {
          NSLocationWhenInUseUsageDescription:
            'Precisamos da sua localização para exibir os restaurantes próximos a você',
        }
      : {
          UIBackgroundModes: ['location'],
          NSLocationWhenInUseUsageDescription:
            'Precisamos da sua localização para enviar corridas próximas e monitorar a entrega.',
          NSLocationAlwaysAndWhenInUseUsageDescription:
            'Precisamos da sua localização para enviar corridas próximas e monitorar a entrega.',
        },
  associatedDomains: [
    `applinks:${getBaseDomain(environment)}`,
    `applinks:${getDeeplinkDomain(environment)}`,
    `applinks:${getFallbackDomain(environment)}`,
  ],
  config: {
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  },
});

const intentFilter = (host: string, pathPrefix: string) => ({
  action: 'VIEW',
  autoVerify: false,
  data: [
    {
      scheme: 'https',
      host,
      pathPrefix,
    },
  ],
  category: ['BROWSABLE', 'DEFAULT'],
});

const intentFilters = () =>
  [
    intentFilter(getBaseDomain(environment), `/${flavor}`),
    intentFilter(getDeeplinkDomain(environment), `/${flavor}`),
    intentFilter(getFallbackDomain(environment), `/${flavor}`),
  ]
    .concat(flavor === 'consumer' ? [intentFilter(getBaseDomain(environment), `/r`)] : [])
    .concat(flavor === 'courier' ? [intentFilter(getBaseDomain(environment), `/f`)] : []);

const android = () =>
  ((
    {
      android: {
        package: appBundlePackage(),
        versionCode,
        adaptiveIcon: {
          foregroundImage: icon('android'),
          backgroundColor: flavor === 'consumer' ? '#78E08F' : '#FFE493',
        },
        googleServicesFile: `./google-services-${environment}.json`,
        useNextNotificationsApi: true,
        softwareKeyboardLayoutMode: 'pan',
        permissions: permissions(),
        intentFilters: intentFilters(),
        config: {
          googleMaps: {
            apiKey: GOOGLE_MAPS_API_KEY,
          },
        },
      },
    } as ExpoConfig
  ).android);

const permissions = () =>
  flavor === 'consumer'
    ? ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION']
    : [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'VIBRATE',
        // 'RECORD_AUDIO',
      ];

const extra = (): Extra => ({
  flavor,
  environment,
  bundleIdentifier: appBundlePackage(),
  androidPackage: appBundlePackage(),
  firebase: {
    apiKeyAndroid: FIREBASE_API_KEY_ANDROID!,
    apiKeyiOS: FIREBASE_API_KEY_IOS!,
    authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
    region: FIREBASE_REGION!,
    projectId: FIREBASE_PROJECT_ID!,
    storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID!,
    appId: flavor === 'consumer' ? FIREBASE_CONSUMER_APP_ID! : FIREBASE_COURIER_APP_ID!,
    emulator: {
      enabled: process.env.FIREBASE_EMULATOR === 'true',
      host: FIREBASE_EMULATOR_HOST,
    },
    measurementId:
      flavor === 'consumer' ? FIREBASE_CONSUMER_MEASUREMENT_ID! : FIREBASE_COURIER_MEASUREMENT_ID!,
  },
  googleMapsApiKey: GOOGLE_MAPS_API_KEY!,
  analytics: {
    segmentConsumerAndroidKey: SEGMENT_CONSUMER_ANDROID_KEY!,
    segmentConsumeriOSKey: SEGMENT_CONSUMER_IOS_KEY!,
    segmentCourierAndroidKey: SEGMENT_COURIER_ANDROID_KEY!,
    segmentCourieriOSKey: SEGMENT_COURIER_IOS_KEY!,
    sentryDNS: SENTRY_DSN!,
  },
  iugu: {
    accountId: IUGU_ACCOUNT_ID!,
  },
  algolia: {
    appId: ALGOLIA_APPID!,
    apiKey: ALGOLIA_APIKEY!,
  },
});

const hooks = () => ({
  postPublish: [
    {
      file: 'sentry-expo/upload-sourcemaps',
      config: {
        organization: 'app-justo',
        project: 'app',
        authToken: SENTRY_AUTH_TOKEN,
      },
    },
  ],
});
