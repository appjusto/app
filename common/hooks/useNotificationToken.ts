import Constants from 'expo-constants';
import {
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications';
import firebase from 'firebase';
import React from 'react';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../app/context';
import { getFlavor } from '../store/config/selectors';
import { getConsumer } from '../store/consumer/selectors';
import { getCourier } from '../store/courier/selectors';
import { getUser } from '../store/user/selectors';

type ErrorType = 'permission-denied' | 'not-a-device' | 'unknown-error';
type Returntype = [string | null, boolean, boolean, ErrorType | null];

const getPushToken = (retries: number): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await getExpoPushTokenAsync()).data);
    } catch (error) {
      if (retries === 0) reject(error);
      else setTimeout(async () => resolve(await getPushToken(retries - 1)), 1000);
    }
  });
};

export const useNotificationToken = (): Returntype => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const flavor = useSelector(getFlavor);
  const currentNotificationToken =
    flavor === 'consumer' ? consumer?.notificationToken : courier?.notificationToken;
  // state
  const [token, setToken] = React.useState<string | null>(null);
  const [error, setError] = React.useState<ErrorType | null>(null);
  const shouldDeleteToken = error !== null || token === null;
  // cases that we need to update token:
  // some error ocurred; token is not valid (null); token is different from what's on the backend
  const shouldUpdateToken = !shouldDeleteToken && token !== currentNotificationToken;

  const askPermission = async () => {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === 'granted') {
      try {
        setToken(await getPushToken(5));
      } catch (error) {
        setError('unknown-error');
        console.log('Error while calling Notifications.getExpoPushTokenAsync()');
        console.log(error);
        Sentry.Native.captureException(error);
      }
    } else {
      setError('permission-denied');
    }
  };

  React.useEffect(() => {
    // won't work in simulator; only in physical devices
    if (!Constants.isDevice) {
      setError('not-a-device');
    } else {
      askPermission();
    }
  }, []);
  React.useEffect(() => {
    if (!user?.uid) return;
    if (shouldDeleteToken || shouldUpdateToken) {
      api.profile().updateProfile(user.uid, {
        notificationToken: shouldUpdateToken ? token : null,
        updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  }, [token, user?.uid, shouldDeleteToken, shouldUpdateToken, api]);

  return [token, shouldDeleteToken, shouldUpdateToken, error];
};
