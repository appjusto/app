import { Order } from 'appjusto-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { t } from '../../../strings';
import { colors, padding, texts } from '../../styles';
import { formatCurrency } from '../../utils/formatters';

type Props = {
  order: Order;
};

export default function ({ order }: Props) {
  return (
    <View>
      <Text style={[texts.mediumToBig]}>{t('Entenda os valores')}</Text>
      <Text style={[texts.small, { color: colors.darkGrey }]}>
        {t('Somos transparentes do início ao fim da entrega')}
      </Text>
      <View style={{ marginTop: padding }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.priceDetailText}>{t('Entregador')}</Text>
          <Text style={styles.priceDetailText}>{formatCurrency(order.fare?.courierFee ?? 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.priceDetailText}>{t('Gorjeta')}</Text>
          <Text style={styles.priceDetailText}>{formatCurrency(order.fare?.courierTip ?? 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.priceDetailText}>{t('Impostos')}</Text>
          <Text style={styles.priceDetailText}>{formatCurrency(order.fare?.taxes ?? 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.priceDetailText}>{t('Tarifa financeira')}</Text>
          <Text style={styles.priceDetailText}>
            {formatCurrency(order.fare?.financialFee ?? 0)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.priceDetailText}>{t('App Justo')}</Text>
          <Text style={styles.priceDetailText}>{formatCurrency(order.fare?.platformFee ?? 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[texts.medium]}>{t('Total')}</Text>
          <Text style={[texts.medium]}>{formatCurrency(order.fare?.total ?? 0)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  priceDetailText: {
    ...texts.medium,
    color: colors.darkGrey,
  },
});
