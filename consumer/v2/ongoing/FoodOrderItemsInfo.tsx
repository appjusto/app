import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Order, WithId } from '../../../../types';
import HR from '../../../common/components/views/HR';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { DeliveredItems } from '../common/DeliveredItems';

type Props = {
  order: WithId<Order>;
};

export const FoodOrderItemsInfo = ({ order }: Props) => {
  return order.type === 'food' ? (
    <View style={{ flex: 1 }}>
      <HR height={padding} />
      <View style={{ paddingTop: halfPadding }}>
        <DeliveredItems order={order} />
      </View>
      {order.additionalInfo ? (
        <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="info" size={14} />
            <Text style={{ ...texts.sm, marginLeft: 4 }}>{t('Informações adicionais')}</Text>
          </View>
          <Text style={{ ...texts.xs, color: colors.grey700, marginTop: 4 }}>
            {order.additionalInfo}
          </Text>
        </View>
      ) : null}
    </View>
  ) : null;
};
