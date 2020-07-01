import Constants from 'expo-constants';

export const getExtra = () => Constants.manifest.extra;

export default ({ config }) => {
  const { extra } = config;
  return {
    ...config,
    extra: {
      ...extra,
    },
  };
};