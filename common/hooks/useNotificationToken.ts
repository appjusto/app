import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import { t } from '../../strings';
import { colors } from '../styles';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

if (Platform.OS === 'android') {
  (async () => {
    // await Notifications.deleteNotificationChannelAsync('order-request');
    // const notificationChannels = await Notifications.getNotificationChannelsAsync();
    // console.log(notificationChannels);
    Notifications.setNotificationChannelAsync('order-request', {
      name: t('Novas corridas'),
      importance: Notifications.AndroidImportance.HIGH,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
    });
    Notifications.setNotificationChannelAsync('order-update', {
      name: t('Atualizações do pedido'),
      importance: Notifications.AndroidImportance.HIGH,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
    });
    Notifications.setNotificationChannelAsync('order-chat', {
      name: t('Chat durante entrega'),
      importance: Notifications.AndroidImportance.HIGH,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.green100,
    });
  })();
}

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
        Sentry.Native.captureException(error);
        console.log('Error while calling Notifications.getExpoPushTokenAsync()');
        console.error(error);
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
