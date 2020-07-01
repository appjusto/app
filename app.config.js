import Constants from 'expo-constants';
import { APP_FLAVOR } from 'react-native-dotenv';

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
    },
  };
};