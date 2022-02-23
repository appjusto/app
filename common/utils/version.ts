import Constants from 'expo-constants';
import { version } from '../../version.json';

export const getAppVersion = () => {
  return version;
};

export const getNativeAndManifestVersion = () => {
  return `${Constants.nativeAppVersion} / ${Constants.manifest?.version}`;
};

export const isCurrentVersionAllowed = (minVersion: string) => {
  return (
    getAppVersion().localeCompare(minVersion, undefined, { numeric: true, sensitivity: 'base' }) >=
    0
  );
};
