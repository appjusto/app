import { PushMessage, PushMessageData } from 'appjusto-types';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { useQueryClient } from 'react-query';

type Props = {
  children: React.ReactNode;
};

export default function ({ children }: Props) {
  // context
  const queryClient = useQueryClient();
  // helpers
  const add = React.useCallback((id: string, data: PushMessageData, clicked: boolean) => {
    queryClient.setQueryData(
      ['notifications', data.action],
      (notifications: PushMessage[] | undefined) => [
        ...(notifications ?? []),
        { id, data, clicked },
      ]
    );
  }, []);

  // handlers
  // called whenever a notification is received while the app is running.
  const receivedHandler = React.useCallback(async (notification: Notifications.Notification) => {
    const { request } = notification;
    const id = request.identifier;
    // console.log('notification received (not clicked):', id);
    const data = (request.content.data as unknown) as PushMessageData;
    // add message to queryClient
    add(id, data, false);
    // dismiss notification if the app in running
    // Notifications.dismissNotificationAsync(id);
  }, []);

  // called whenever a user interacts with a notification (eg. taps on it).
  const responseReceivedHandler = React.useCallback(
    (response: Notifications.NotificationResponse) => {
      const { notification } = response;
      const { request } = notification;
      const id = request.identifier;
      // console.log('notification clicked:', id);
      const data = (request.content.data as unknown) as PushMessageData;
      // check if message was already added to the cache (it could happen if the app is in foreground and user clicks on the notification)
      const alreadyAdded =
        queryClient
          .getQueryData<PushMessage[]>(['notifications', data.action])
          ?.some((m) => m.id === id) ?? false;
      if (!alreadyAdded) {
        add(id, data, true);
      } else {
        // if was already added, change clicked to true
        queryClient.setQueryData(
          ['notifications', data.action],
          (notifications: PushMessage[] | undefined) => {
            // console.log('before:', notifications);
            const updated = (notifications ?? []).map((n) => ({
              ...n,
              // nulish operator isn't working here for some reason
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              clicked: n.clicked || n.id === id,
            }));
            return updated;
          }
        );
      }
      // dismiss all other notifications of this type
      queryClient
        .getQueryData<PushMessage[]>(['notifications', data.action])
        ?.forEach((n) => {
          if (n.id !== id) {
            Notifications.dismissNotificationAsync(n.id);
          }
        });
    },
    []
  );

  // effects
  React.useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(receivedHandler);
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      responseReceivedHandler
    );

    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
    };
  }, []);

  return children as JSX.Element;
}
