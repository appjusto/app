import { ChatMessageUser, LatLng, Order, WithId } from '@appjusto/types';
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
  courierLocation?: LatLng | null;
  onCourierDetail: () => void;
  onChatWithCourier: () => void;
  onOpenChat: (from: ChatMessageUser) => void;
};

export const OngoingMapAndInfo = ({
  order,
  courierLocation,
  onCourierDetail,
  onChatWithCourier,
  onOpenChat,
}: Props) => {
  const { fulfillment, status, dispatchingStatus } = order;
  if (fulfillment === 'delivery' && status !== 'dispatching') return null;
  return (
    <View>
      {dispatchingStatus === 'outsourced' ? (
        <View>
          <HR height={padding} />
          <DeliveryInfo order={order} onCourierDetail={onCourierDetail} />
        </View>
      ) : (
        <View>
          <OrderMap
            originLocation={order.origin?.location}
            destinationLocation={order.destination?.location}
            courierLocation={fulfillment === 'delivery' ? courierLocation : undefined}
            route={fulfillment === 'delivery' ? order.route : undefined}
            ratio={240 / 160}
            orderFulfillment={fulfillment}
          />
          {fulfillment === 'delivery' ? (
            <View>
              <MessagesCard orderId={order.id} onPress={onOpenChat} />
              <View>
                <DeliveryInfo order={order} onCourierDetail={onCourierDetail} />
                <DefaultButton
                  title={t('Abrir chat com o entregador')}
                  onPress={() => onChatWithCourier()}
                  style={{ marginHorizontal: padding, marginBottom: padding }}
                />
              </View>
              <HR height={padding} />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};
