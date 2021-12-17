import Constants from 'expo-constants';

const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const getAppVersion = () => {
  return Constants.manifest?.version ?? Constants.nativeAppVersion ?? '';
};

export const getNativeAndManifestVersion = () => {
  return `${Constants.nativeAppVersion} / ${Constants.manifest?.version}`;
};

export const isCurrentVersionAllowed = (minVersion: string) => {
  const current = SEMVER_REGEX.exec(getAppVersion())?.slice(1, 4);
  const min = SEMVER_REGEX.exec(minVersion)?.slice(1, 4);
  if (!current || !min) return true;
  if (parseInt(current[0]) < parseInt(min[0])) return false;
  if (parseInt(current[1]) < parseInt(min[1])) return false;
  return parseInt(current[2]) > parseInt(min[2]);
};
