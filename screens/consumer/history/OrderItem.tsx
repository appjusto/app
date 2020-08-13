import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { Order } from '../../../store/order/types';
import { t } from '../../../strings';
import ArrowBox from '../../common/ArrowBox';
import { colors, texts, borders, padding } from '../../common/styles';
import StatusBadge from './StatusBadge';

type Props = {
  order: Order;
  onPress: () => void;
};

export default function ({ order, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding, borderBottomColor: colors.grey, borderBottomWidth: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ ...borders.default }}>
            <Text style={{ ...texts.default }}>{order.origin.address}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Pedido No 1')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>
              {t('10/07/2020 - 12h30')}
            </Text>
          </View>
          <ArrowBox />
        </View>
        <StatusBadge status={order.status} />
      </View>
    </TouchableOpacity>
  );
}
