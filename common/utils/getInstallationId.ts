import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { nanoid } from 'nanoid/non-secure';
import * as Sentry from 'sentry-expo';

export const getInstallationId = async () => {
  try {
    let value = await SecureStore.getItemAsync('installation-id');
    if (!value) {
      value = Application.androidId ?? nanoid();
      await SecureStore.setItemAsync('installation-id', value);
    }
    return value;
  } catch (e: any) {
    Sentry.Native.captureException(e);
  }
  return null;
};
