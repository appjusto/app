import { Order } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import { IconRequest } from '../../../../common/icons/icon-requests';

interface Props {
  order: Order;
}

export const OngoingOrderStatus = ({ order }: Props) => {
  // if (order.type === 'p2p') return null;
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <IconRequest />
    </View>
  );
};
