import * as Notifications from 'expo-notifications';
import { useEffect, useCallback } from 'react';

export default function (
  handler: (notificationContent: Notifications.NotificationContent) => void
) {
  // handlers
  const notificationHandler = useCallback(
    (notification: Notifications.Notification) => {
      handler(notification.request.content);
    },
    [handler]
  );

  const notificationResponseHandler = useCallback(
    (response: Notifications.NotificationResponse) => {
      handler(response.notification.request.content);
    },
    [handler]
  );

  // side effects
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notificationHandler);
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      notificationResponseHandler
    );

    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
      // Notifications.removeAllNotificationListeners();
    };
  }, [handler]);
}
