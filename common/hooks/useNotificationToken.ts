import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useState, useEffect } from 'react';
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
    // await Notifications.deleteNotificationChannelAsync('matching');
    // const notificationChannels = await Notifications.getNotificationChannelsAsync();
    // console.log(notificationChannels);
    Notifications.setNotificationChannelAsync('matching', {
      name: t('Corridas'),
      importance: Notifications.AndroidImportance.HIGH,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.lightGreen,
    });
    Notifications.setNotificationChannelAsync('order-chat', {
      name: t('Mensagens da entrega'),
      importance: Notifications.AndroidImportance.HIGH,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.lightGreen,
    });
  })();
}

export default function () {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<'permission-denied' | 'not-a-device' | null>(null);

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
        Sentry.captureException(error);
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

  return [token, error];
}
