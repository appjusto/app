import { Order, Place, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RoundedProfileImg from '../../../../common/components/icons/RoundedProfileImg';
import { CourierDistanceBadge } from '../../../../common/screens/orders/ongoing/CourierDistanceBadge';
import { colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  order: WithId<Order>;
  addressLabel: string;
  nextPlace: Place | null | undefined;
  onChangeRoute: () => void;
};

export const DeliveryInfo = ({ order, addressLabel, nextPlace, onChangeRoute }: Props) => {
  return (
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
        <Text style={[texts.xs, { color: colors.green600 }]}>{addressLabel}</Text>
        <Text style={[texts.xs]}>{nextPlace?.address.main ?? ''}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <CourierDistanceBadge order={order} />
          <TouchableOpacity
            onPress={onChangeRoute}
            // onPress={() => navigation.navigate('CreateOrderP2P', { orderId: order.id })}
            style={{ marginTop: 12 }}
          >
            <Text style={[texts.xs, { color: colors.green600 }]}>{t('Alterar')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
