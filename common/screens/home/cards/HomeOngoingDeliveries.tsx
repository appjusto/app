import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { padding } from '../../../styles';
import HomeOngoingDeliveryCard from './HomeOngoingDeliveryCard';

type Props = {
  orders: WithId<Order>[] | undefined;
  onPress: (order: WithId<Order>, message?: ChatMessageUser) => void;
};

export default function ({ orders, onPress }: Props) {
  // UI
  if (!orders) return null;
  return (
    <View>
      {orders.map((order) => {
        return (
          <View key={order.id} style={{ marginBottom: padding }}>
            <HomeOngoingDeliveryCard order={order} onPress={onPress} />
          </View>
        );
      })}
    </View>
  );
}
