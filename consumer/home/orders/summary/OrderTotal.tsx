import React from 'react';
import { Text, View } from 'react-native';
import Pill from '../../../../common/components/views/Pill';
import { colors, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

interface Props {
  total: number;
}

export const OrderTotal = ({ total }: Props) => {
  return (
    <View style={{ paddingVertical: padding }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pill />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 12,
            flex: 1,
          }}
        >
          <Text style={{ ...texts.medium, ...texts.bold }}>{t('Valor total a pagar')}</Text>
          <Text style={{ ...texts.mediumToBig }}>{formatCurrency(total)}</Text>
        </View>
      </View>
      <Text
        style={{
          marginTop: padding,
          ...texts.small,
          color: colors.darkGrey,
          paddingHorizontal: padding,
        }}
      >
        {t(
          'Você poderá deixar uma Caixinha de gorjeta para o entregador quando o seu pedido for entregue.'
        )}
      </Text>
    </View>
  );
};
