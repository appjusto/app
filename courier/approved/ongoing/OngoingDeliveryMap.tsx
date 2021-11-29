import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { StatusAndMessages } from '../../../common/screens/orders/ongoing/StatusAndMessages';
import OrderMap from '../../../common/screens/orders/OrderMap';

type Props = {
  order: WithId<Order>;
  onOpenChat: (from: ChatMessageUser) => void;
};

export const OngoingDeliveryMap = ({ order, onOpenChat }: Props) => {
  return order.dispatchingState === 'arrived-destination' ? null : (
    <View>
      <OrderMap order={order!} ratio={1} />
      <View>
        <StatusAndMessages order={order} onPress={onOpenChat} />
      </View>
    </View>
  );
};
