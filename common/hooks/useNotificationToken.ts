import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../app/context';
import { getFlavor } from '../store/config/selectors';
import { getConsumer } from '../store/consumer/selectors';
import { getCourier } from '../store/courier/selectors';
import { getUser } from '../store/user/selectors';

type ErrorType = 'permission-denied' | 'not-a-device';
type Returntype = [string | null, boolean, boolean, ErrorType | null];

export default function (): Returntype {
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
      api
        .profile()
        .updateProfile(user.uid, { notificationToken: shouldUpdateToken ? token : null });
    }
  }, [token, user?.uid, shouldDeleteToken, shouldUpdateToken, api]);

  return [token, shouldDeleteToken, shouldUpdateToken, error];
}
