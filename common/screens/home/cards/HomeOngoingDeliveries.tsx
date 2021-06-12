import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { padding } from '../../../styles';
import HomeOngoingDeliveryCard from './HomeOngoingDeliveryCard';

type Props = {
  orders: WithId<Order>[] | undefined;
  onOpenChat: (order: WithId<Order>, message?: ChatMessageUser) => void;
};

export default function ({ orders, onOpenChat }: Props) {
  // UI
  if (!orders) return null;
  return (
    <View>
      {orders.map((order) => {
        return (
          <View key={order.id} style={{ marginBottom: padding }}>
            <HomeOngoingDeliveryCard order={order} onOpenChat={onOpenChat} />
          </View>
        );
      })}
    </View>
  );
}
