import { useState } from 'react';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

export default function () {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  if (token) return [token, null];
  if (error) return [null, error];

  // won't work in simulator; only in physical devices
  if (!Constants.isDevice) {
    setError('not-a-device');
    return [null, null];
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const askPermission = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus === 'granted') {
      setToken((await Notifications.getExpoPushTokenAsync()).data);
    }
    else {
      setError('permission-denied');
    }
  }
  askPermission();
  return [token, error];
}