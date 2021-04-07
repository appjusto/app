import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import { getOrderTotal } from '../../../../../common/store/api/order/helpers';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

interface Props {
  order: WithId<Order> | undefined;
  onCheckout: () => void;
  canProceed: boolean;
}

export const CartButton = ({ order, onCheckout, canProceed }: Props) => {
  if (!order?.items?.length) return null;
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: halfPadding }}>
      <TouchableOpacity onPress={onCheckout}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: padding,
            paddingVertical: 12,
            backgroundColor: canProceed ? colors.green500 : colors.yellow,
            borderRadius: 8,
          }}
        >
          <RoundedText>{`${order.items?.length ?? 0} ${t('itens')}`}</RoundedText>
          <Text style={{ ...texts.sm }}>{t('Ver sacola')}</Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(getOrderTotal(order))}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
