import { PushMessage, PushMessageData } from '@appjusto/types';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { LoggedNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'MainNavigator'>;

export const useNotificationHandler = (
  action: string,
  handler: (data: PushMessageData, clicked?: boolean, remove?: () => void) => void
) => {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  // state
  const queryClient = useQueryClient();
  const query = useQuery<PushMessage[]>(['notifications', action], () => []);
  // callbacks
  const remove = React.useCallback(
    (id: string) => {
      Notifications.dismissNotificationAsync(id);
      queryClient.setQueryData(['notifications', action], (notifications: PushMessage[] = []) =>
        notifications.filter((n) => n.id !== id)
      );
    },
    [action, queryClient]
  );
  // side effects
  React.useEffect(() => {
    if (!query.data || query.data.length === 0) return;
    const [notification] = query.data;
    const { clicked, data, id } = notification;
    handler(data, clicked, () => remove(id));
  }, [query.data, navigation, handler, remove]);
};
