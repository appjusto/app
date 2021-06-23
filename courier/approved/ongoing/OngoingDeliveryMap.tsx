import React from 'react';
import { View } from 'react-native';
import { ChatMessageUser, Order, WithId } from '../../../../types';
import { StatusAndMessages } from '../../../common/screens/orders/ongoing/StatusAndMessages';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { RouteIcons } from './RouteIcons';

type Props = {
  order: WithId<Order>;
  onOpenChat: (from: ChatMessageUser) => void;
};

export const OngoingDeliveryMap = ({ order, onOpenChat }: Props) => {
  return (
    <View>
      <OrderMap order={order!} ratio={1} />
      <RouteIcons order={order} />
      <View>
        <StatusAndMessages order={order} onPress={onOpenChat} />
      </View>
    </View>
  );
};
