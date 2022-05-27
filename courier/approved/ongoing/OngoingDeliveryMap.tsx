import { ChatMessageUser, LatLng, Order, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import ShowIf from '../../../common/components/views/ShowIf';
import { StatusAndMessages } from '../../../common/screens/orders/ongoing/StatusAndMessages';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { getCourier } from '../../../common/store/courier/selectors';
import { RouteIcons } from './RouteIcons';

type Props = {
  order: WithId<Order>;
  onOpenChat: (from: ChatMessageUser) => void;
  isLoading: boolean;
};

export const OngoingDeliveryMap = ({ order, onOpenChat, isLoading }: Props) => {
  // redux
  const courier = useSelector(getCourier);
  const location = courier?.coordinates
    ? ({
        latitude: courier.coordinates.latitude,
        longitude: courier.coordinates.longitude,
      } as LatLng)
    : null;
  // UI
  if (order.dispatchingState === 'arrived-destination') return null;
  return (
    <View>
      <OrderMap
        originLocation={order.origin?.location}
        destinationLocation={order.destination?.location}
        courierLocation={location}
        route={order.route}
        ratio={1}
      />
      <ShowIf test={!isLoading}>{() => <RouteIcons order={order} />}</ShowIf>
      <View>
        <StatusAndMessages order={order} onPress={onOpenChat} />
      </View>
    </View>
  );
};
