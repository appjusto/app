import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useEffect, useState } from 'react';
import * as Sentry from 'sentry-expo';

type ErrorType = 'permission-denied' | 'not-a-device';
type Returntype = [string | null, boolean, boolean, ErrorType | null];

export default function (currentNotificationToken?: string | null): Returntype {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const shouldDeleteToken = error !== null || token === null;
  // cases that we need to update token:
  // some error ocurred; token is not valid (null); token is different from what's on the backend
  const shouldUpdateToken = !shouldDeleteToken && token !== currentNotificationToken;

  const askPermission = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus === 'granted') {
      try {
        setToken((await Notifications.getExpoPushTokenAsync()).data);
      } catch (error) {
        console.log('Error while calling Notifications.getExpoPushTokenAsync()');
        console.log(error);
        Sentry.Native.captureException(error);
      }
    } else {
      setError('permission-denied');
    }
  };

  useEffect(() => {
    // won't work in simulator; only in physical devices
    if (!Constants.isDevice) {
      setError('not-a-device');
    } else {
      askPermission();
    }
  }, []);

  return [token, shouldDeleteToken, shouldUpdateToken, error];
}
