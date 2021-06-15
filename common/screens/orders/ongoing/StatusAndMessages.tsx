import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { MessagesCard } from '../../home/cards/MessagesCard';
import CourierStatusHighlight from './CourierStatusHighlight';

interface Props {
  order: WithId<Order>;
  onPress: (from: ChatMessageUser) => void;
}

export const StatusAndMessages = ({ order, onPress, ...props }: Props) => {
  return (
    <View {...props}>
      <MessagesCard orderId={order.id} onPress={onPress} />
      <CourierStatusHighlight order={order} />
    </View>
  );
};
