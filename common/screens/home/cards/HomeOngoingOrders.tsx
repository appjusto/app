import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { getOrders } from '../../../store/order/selectors';
import { padding } from '../../../styles';
import HomeOngoingDeliveryCard from './HomeOngoingDeliveryCard';

type Props = {
  onPress: (order: WithId<Order>, message?: ChatMessageUser) => void;
};

export const HomeOngoingOrders = ({ onPress }: Props) => {
  const orders = useSelector(getOrders);
  // UI
  if (!orders?.length) return null;
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
};
