import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { nanoid } from 'nanoid/non-secure';
import * as Sentry from 'sentry-expo';

export const getInstallationId = async () => {
  let value = null;
  try {
    // https://github.com/expo/expo/issues/814
    value = await SecureStore.getItemAsync('installation-id');
  } catch (e: any) {
    console.error(e);
  }
  try {
    if (!value) {
      value = Application.androidId ?? nanoid();
      await SecureStore.setItemAsync('installation-id', value);
    }
    return value;
  } catch (e: any) {
    console.error('getInstallationId');
    Sentry.Native.captureException(e);
  }
  return null;
};
