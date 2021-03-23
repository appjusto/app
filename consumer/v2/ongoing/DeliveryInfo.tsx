import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import { CourierDistanceBadge } from '../../../common/screens/orders/ongoing/CourierDistanceBadge';
import { colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
  onCourierDetail: () => void;
};

export const DeliveryInfo = ({ order, onCourierDetail }: Props) => {
  return (
    <TouchableOpacity onPress={onCourierDetail}>
      <View
        style={{
          backgroundColor: colors.white,
          flexDirection: 'row',
          paddingHorizontal: padding,
          paddingVertical: padding,
        }}
      >
        <RoundedProfileImg flavor="courier" id={order.courier?.id} />
        <View style={{ flex: 1, marginLeft: padding }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[texts.md]}>{order.courier?.name}</Text>
          </View>
          <Text style={[texts.xs, { color: colors.grey700 }]}>
            {order.status === 'confirmed' ? t('Aguardando entregador') : t('Conheça o entregador')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {order.status !== 'confirmed' && (
            <View>
              <CourierDistanceBadge order={order} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
