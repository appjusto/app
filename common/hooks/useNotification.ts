import * as Notifications from 'expo-notifications';
import { useEffect, useCallback } from 'react';

export default function (
  handler: (notificationContent: Notifications.NotificationContent) => void
) {
  // handlers
  const receivedHandler = useCallback(
    async (notification: Notifications.Notification) => {
      handler(notification.request.content);
    },
    [handler]
  );

  const responseReceivedHandler = useCallback(
    (response: Notifications.NotificationResponse) => {
      handler(response.notification.request.content);
    },
    [handler]
  );

  // side effects
  useEffect(() => {
    // Listeners registered by this method will be called whenever a notification is received while the app is running.
    const subscription = Notifications.addNotificationReceivedListener(receivedHandler);
    // Listeners registered by this method will be called whenever a user interacts with a notification (eg. taps on it).
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      responseReceivedHandler
    );

    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
      // Notifications.removeAllNotificationListeners();
    };
  }, [handler]);
}
