import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import { getOrderTotal } from '../../../../../common/store/api/order/helpers';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

interface Props {
  order: WithId<Order> | undefined;
}

export const CartButton = ({ order }: Props) => {
  if (!order?.items?.length) return null;
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: halfPadding }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: padding,
          paddingVertical: 12,
          backgroundColor: colors.green500,
          borderRadius: 8,
        }}
      >
        <RoundedText>{`${order.items?.length ?? 0} ${t('itens')}`}</RoundedText>
        <Text style={{ ...texts.sm }}>{t('Ver sacola')}</Text>
        <Text style={{ ...texts.sm }}>{formatCurrency(getOrderTotal(order))}</Text>
      </View>
    </View>
  );
};
