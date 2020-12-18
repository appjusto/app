import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { getOngoingOrders } from '../../../store/order/selectors';
import { padding } from '../../../styles';
import HomeOngoingDeliveryCard from './HomeOngoingDeliveryCard';

type Props = {
  onSelect: (order: WithId<Order>, openChat: boolean) => void;
};

export default function ({ onSelect }: Props) {
  // app state
  const ongoingOrders = useSelector(getOngoingOrders);

  // UI
  if (ongoingOrders.length === 0) return null;
  return (
    <View>
      {ongoingOrders.map((order) => {
        return (
          <View key={order.id} style={{ marginBottom: padding }}>
            <HomeOngoingDeliveryCard order={order} onSelect={onSelect} />
          </View>
        );
      })}
    </View>
  );
}
