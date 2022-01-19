import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import { CourierDistanceBadge } from '../../../common/screens/orders/ongoing/CourierDistanceBadge';
import { colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
  onCourierDetail: () => void;
};

export const DeliveryInfo = ({ order, onCourierDetail }: Props) => {
  const { dispatchingStatus } = order;
  const deliveryInfoUI = () => {
    if (dispatchingStatus === 'outsourced') {
      if (order.courier?.name) {
        return (
          <View
            style={{
              backgroundColor: colors.white,
              // flexDirection: 'row',
              paddingHorizontal: padding,
              paddingVertical: padding,
              flex: 1,
            }}
          >
            <Text style={[texts.md]}>{order.courier?.name ?? 'Nome do courier'}</Text>
            <Text style={[texts.xs, { color: colors.grey700 }]}>
              {t('Entregador externo alocado')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <CourierDistanceBadge order={order} />
              </View>
            </View>
          </View>
        );
      } else return null;
    } else
      return (
        <TouchableOpacity onPress={onCourierDetail}>
          <View
            style={{
              backgroundColor: colors.white,
              flexDirection: 'row',
              paddingHorizontal: padding,
              paddingVertical: padding,
              flex: 1,
            }}
          >
            <RoundedProfileImg flavor="courier" id={order.courier?.id} size={48} />
            <View style={{ flex: 1, marginLeft: padding }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[texts.md]}>{order.courier?.name}</Text>
              </View>
              <Text style={[texts.xs, { color: colors.grey700 }]}>
                {t('Conheça o/a entregador/a')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <CourierDistanceBadge order={order} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
  };
  return deliveryInfoUI();
};
