import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { padding } from '../../../styles';
import { MessagesCard } from '../../home/cards/MessagesCard';
import CourierStatusHighlight from './CourierStatusHighlight';

type Props = {
  order: WithId<Order>;
  onMessageReceived: () => void;
};

export const StatusAndMessages = ({ order, onMessageReceived, ...props }: Props) => {
  return (
    <View {...props}>
      <CourierStatusHighlight order={order} />
      <View
        style={{
          width: '100%',
          top: -176,
          alignSelf: 'center',
          paddingHorizontal: padding,
        }}
      >
        <MessagesCard orderId={order.id} onPress={onMessageReceived} />
      </View>
    </View>
  );
};
