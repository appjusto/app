import { PushMessage } from '@appjusto/types';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useQuery } from 'react-query';
import { LoggedNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'MainNavigator'>;

export const useNotificationHandler = () => {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  // state
  const chatQuery = useQuery<PushMessage[]>(['notifications', 'order-chat'], () => []);
  const orderUpdateQuery = useQuery<PushMessage[]>(['notifications', 'order-update'], () => []);
  // side effects
  // react to order-chat
  React.useEffect(() => {
    if (!chatQuery.data || chatQuery.data.length === 0) return;
    const [notification] = chatQuery.data;
    if (notification.clicked) {
      navigation.navigate('OngoingOrderNavigator', {
        screen: 'OngoingOrder',
        params: {
          orderId: notification.data.orderId,
          newMessage: true,
        },
      });
    }
  }, [chatQuery.data, navigation]);
  // react to order-update
  React.useEffect(() => {
    if (!orderUpdateQuery.data || orderUpdateQuery.data.length === 0) return;
    const [notification] = orderUpdateQuery.data;
    if (notification.clicked) {
      navigation.navigate('OngoingOrderNavigator', {
        screen: 'OngoingOrder',
        params: {
          orderId: notification.data.orderId,
        },
      });
    }
  }, [orderUpdateQuery.data, navigation]);
};
