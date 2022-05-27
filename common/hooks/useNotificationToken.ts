import * as Device from 'expo-device';
import {
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications';
import { serverTimestamp } from 'firebase/firestore';
import React from 'react';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../app/context';
import { getManager } from '../store/business/selectors';
import { getFlavor } from '../store/config/selectors';
import { getConsumer } from '../store/consumer/selectors';
import { getCourier } from '../store/courier/selectors';
import { getUser } from '../store/user/selectors';

type ErrorType = 'permission-denied' | 'not-a-device' | 'unknown-error';

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

export const useNotificationToken = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const manager = useSelector(getManager);
  const flavor = useSelector(getFlavor);
  const profile = flavor === 'consumer' ? consumer! : flavor === 'courier' ? courier! : manager!;
  const currentNotificationToken = profile?.notificationToken;
  // state
  const [token, setToken] = React.useState<string | null>();
  const [error, setError] = React.useState<ErrorType>();
  // helpers
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
  // side effects
  // initial
  React.useEffect(() => {
    // won't work in simulator; only in physical devices
    if (!Device.isDevice) {
      setError('not-a-device');
    } else {
      askPermission();
    }
  }, []);
  // when error changes
  React.useEffect(() => {
    if (!error) return;
    setToken(null);
  }, [error]);
  // when token changes
  React.useEffect(() => {
    if (!user?.uid) return;
    if (token === undefined) return;
    const tokenChanged = currentNotificationToken !== token;
    console.log('currentNotificationToken', currentNotificationToken, 'token', token, tokenChanged);
    if (!tokenChanged) return;
    api
      .profile()
      .updateProfile(user.uid, {
        notificationToken: token,
        updatedOn: serverTimestamp(),
      })
      .then(null);
  }, [token, currentNotificationToken, user?.uid, api]);
};
