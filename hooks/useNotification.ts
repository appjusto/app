import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useEffect, useCallback } from 'react';
import { Platform, ToastAndroid } from 'react-native';

export default function () {
  // context
  const navigation = useNavigation();

  // handlers
  const handle = useCallback((notification: Notifications.Notification) => {
    const { content } = notification.request;

    // debugging:start
    console.log('handling notification');
    console.log(content.data);
    if (Platform.OS === 'android') {
      ToastAndroid.show(JSON.stringify(content.data), ToastAndroid.LONG);
    }
    // debugging:end

    if (content.data.action === 'matching') {
      navigation.navigate('Matching', { data: content.data });
    }
  }, []);

  const notificationHandler = useCallback((notification: Notifications.Notification) => {
    handle(notification);
  }, []);

  const notificationResponseHandler = useCallback(
    (response: Notifications.NotificationResponse) => {
      handle(response.notification);
    },
    []
  );

  // side effects
  useEffect(() => {
    Notifications.addNotificationReceivedListener(notificationHandler);
    Notifications.addNotificationResponseReceivedListener(notificationResponseHandler);

    return () => {
      Notifications.removeAllNotificationListeners();
    };
  }, []);
}
