import { PushMessage, PushMessageData } from '@appjusto/types';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useQuery } from 'react-query';
import { LoggedNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'MainNavigator'>;

export const useNotificationHandler = (
  action: string,
  handler: (data: PushMessageData, clicked?: boolean) => void
) => {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  // state
  const query = useQuery<PushMessage[]>(['notifications', action], () => []);
  // side effects
  React.useEffect(() => {
    if (!query.data || query.data.length === 0) return;
    const [notification] = query.data;
    const { clicked, data } = notification;
    handler(data, clicked);
  }, [query.data, navigation, handler]);
};
