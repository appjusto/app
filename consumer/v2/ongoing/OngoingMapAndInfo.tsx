import React from 'react';
import { View } from 'react-native';
import { Order, WithId } from '../../../../types';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HR from '../../../common/components/views/HR';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { padding } from '../../../common/styles';
import { t } from '../../../strings';
import { DeliveryInfo } from './DeliveryInfo';

type Props = {
  order: WithId<Order>;
  onCourierDetail: () => void;
  onChatWithCourier: () => void;
};

export const OngoingMapAndInfo = ({ order, onCourierDetail, onChatWithCourier }: Props) => {
  return order.status === 'dispatching' ? (
    <View>
      <OrderMap order={order} ratio={1} />
      <DeliveryInfo order={order} onCourierDetail={onCourierDetail} />
      <DefaultButton
        title={t('Abrir chat com o entregador')}
        onPress={() => onChatWithCourier()}
        style={{ marginHorizontal: padding, marginBottom: padding }}
      />
      <HR height={padding} />
    </View>
  ) : null;
};
