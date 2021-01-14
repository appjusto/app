import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import { padding } from '../../../styles';
import HomeOngoingDeliveryCard from './HomeOngoingDeliveryCard';

type Props = {
  orders: WithId<Order>[] | undefined;
  onSelect: (order: WithId<Order>, openChat: boolean) => void;
};

export default function ({ orders, onSelect }: Props) {
  // UI
  if (!orders) return null;
  return (
    <View>
      {orders.map((order) => {
        return (
          <View key={order.id} style={{ marginBottom: padding }}>
            <HomeOngoingDeliveryCard order={order} onSelect={onSelect} />
          </View>
        );
      })}
    </View>
  );
}
