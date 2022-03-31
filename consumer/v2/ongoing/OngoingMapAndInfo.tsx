import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HR from '../../../common/components/views/HR';
import { MessagesCard } from '../../../common/screens/home/cards/MessagesCard';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { padding } from '../../../common/styles';
import { t } from '../../../strings';
import { DeliveryInfo } from './DeliveryInfo';

type Props = {
  order: WithId<Order>;
  onCourierDetail: () => void;
  onChatWithCourier: () => void;
  onOpenChat: (from: ChatMessageUser) => void;
};

export const OngoingMapAndInfo = ({
  order,
  onCourierDetail,
  onChatWithCourier,
  onOpenChat,
}: Props) => {
  return order.status === 'dispatching' ? (
    <View>
      <OrderMap
        originLocation={order.origin?.location}
        destinationLocation={order.destination?.location}
        courierLocation={order.courier?.location}
        route={order.route}
        ratio={240 / 160}
      />
      <MessagesCard orderId={order.id} onPress={onOpenChat} />
      {order.dispatchingStatus === 'outsourced' ? (
        <View>
          <DeliveryInfo order={order} onCourierDetail={onCourierDetail} />
        </View>
      ) : (
        <View>
          <DeliveryInfo order={order} onCourierDetail={onCourierDetail} />
          <DefaultButton
            title={t('Abrir chat com o entregador')}
            onPress={() => onChatWithCourier()}
            style={{ marginHorizontal: padding, marginBottom: padding }}
          />
        </View>
      )}
      <HR height={padding} />
    </View>
  ) : null;
};
