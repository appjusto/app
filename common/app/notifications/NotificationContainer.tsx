import { PushMessage, PushMessageActionType, PushMessageData } from '@appjusto/types';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { useQueryClient } from 'react-query';
import { init } from '.';

type Props = {
  children: React.ReactNode;
};

export default function ({ children }: Props) {
  // context
  const queryClient = useQueryClient();
  // helpers
  const add = React.useCallback(
    (id: string, data: PushMessageData, clicked: boolean) => {
      queryClient.setQueryData(
        ['notifications', data.action],
        (notifications: PushMessage[] = []) => [...notifications, { id, data, clicked }]
      );
    },
    [queryClient]
  );
  const dissmissRelatedNotifications = React.useCallback(
    async (id: string, action: PushMessageActionType) => {
      // console.log(`{dissmissRelatedNotifications} #${id}; action: ${action}`);
      const messages = queryClient.getQueryData<PushMessage[]>(['notifications', action]);
      console.log(messages);
      const promises = (messages ?? []).map((m) =>
        m.id !== id ? Notifications.dismissNotificationAsync(m.id) : Promise.resolve()
      );
      Promise.all(promises);
    },
    [queryClient]
  );

  // handlers
  // called whenever a notification is received while the app is running.
  const receivedHandler = React.useCallback(
    async (notification: Notifications.Notification) => {
      const { request } = notification;
      const id = request.identifier;
      // console.log('notification received (not clicked):', id);
      const data = request.content.data as unknown as PushMessageData;
      // console.log(`{receivedHandler} #${id}; data:`, JSON.stringify(data));
      // add message to queryClient
      add(id, data, false);
      await dissmissRelatedNotifications(id, data.action);
      // dismiss notification if the app in running
      // Notifications.dismissNotificationAsync(id);
    },
    [add, dissmissRelatedNotifications]
  );

  // called whenever a user interacts with a notification (eg. taps on it).
  const responseReceivedHandler = React.useCallback(
    (response: Notifications.NotificationResponse) => {
      const { notification } = response;
      const { request } = notification;
      const id = request.identifier;
      // console.log('notification clicked:', id);
      const data = request.content.data as unknown as PushMessageData;
      // check if message was already added to the cache (it could happen if the app is in foreground and user clicks on the notification)
      const alreadyAdded =
        queryClient
          .getQueryData<PushMessage[]>(['notifications', data.action])
          ?.some((m) => m.id === id) ?? false;
      // console.log(`{responseReceivedHandler} #${id}; alreadyAdded: ${alreadyAdded}`);
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
      dissmissRelatedNotifications(id, data.action);
    },
    [queryClient, add, dissmissRelatedNotifications]
  );

  // effects
  React.useEffect(() => {
    (async () => {
      await init(queryClient);
    })();
  }, [queryClient]);
  React.useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(receivedHandler);
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(responseReceivedHandler);

    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
    };
  }, [receivedHandler, responseReceivedHandler]);

  return children as JSX.Element;
}
