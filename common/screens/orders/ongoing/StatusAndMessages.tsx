import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { MessagesCard } from '../../home/cards/MessagesCard';
import CourierStatusHighlight from './CourierStatusHighlight';

type Props = {
  order: WithId<Order>;
  onOpenChat: (from: ChatMessageUser) => void;
};

export const StatusAndMessages = ({ order, onOpenChat, ...props }: Props) => {
  return (
    <View {...props}>
      <MessagesCard orderId={order.id} onOpenChat={onOpenChat} />
      <CourierStatusHighlight order={order} />
    </View>
  );
};
