import { Fare, LedgerEntry, Order, WithId } from '@appjusto/types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getOrderTotal } from '../../../../common/store/api/order/helpers';
import { getFlavor } from '../../../../common/store/config/selectors';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  order: WithId<Order>;
  selectedFare: Fare | undefined;
  hideItems?: boolean;
  ledgerEntry?: LedgerEntry | null;
};

export const OrderCostBreakdown = ({ order, selectedFare, hideItems, ledgerEntry }: Props) => {
  const flavor = useSelector(getFlavor);
  return (
    <View style={{ flex: 1 }}>
      <SingleHeader title={t('Entenda os valores')} />
      <View style={{ paddingTop: halfPadding, paddingBottom: padding, paddingHorizontal: padding }}>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Somos transparentes do início ao fim da entrega')}
        </Text>
        <View style={{ marginTop: padding }}>
          {flavor === 'consumer' && !isEmpty(order.items) && !hideItems ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Itens do pedido')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(getOrderTotal(order))}</Text>
            </View>
          ) : null}
          {flavor === 'consumer' && selectedFare?.platform?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('AppJusto')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.platform.value)}</Text>
            </View>
          ) : null}
          {selectedFare?.courier?.netValue ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Entrega')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.courier.netValue)}</Text>
            </View>
          ) : null}
          {selectedFare?.courier?.value && !selectedFare?.courier?.netValue ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Entrega')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.courier.value)}</Text>
            </View>
          ) : null}
          {flavor === 'consumer' && selectedFare?.courier?.insurance ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Seguro')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.courier.insurance)}</Text>
            </View>
          ) : null}
          {flavor === 'consumer' && selectedFare?.courier?.processing?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Taxas')}</Text>
              <Text style={{ ...texts.sm }}>
                {formatCurrency(selectedFare.courier.processing?.value)}
              </Text>
            </View>
          ) : null}
          {order.tip?.status === 'paid' ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Caixinha')}</Text>
              <Text style={{ ...texts.sm }}>
                {formatCurrency(
                  order.tip.value - (flavor === 'courier' ? order.tip.processing?.value ?? 0 : 0)
                )}
              </Text>
            </View>
          ) : null}
          {ledgerEntry && flavor === 'courier' ? (
            <View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...texts.sm }}>{t('Extra *')}</Text>
                <Text style={{ ...texts.sm }}>{formatCurrency(ledgerEntry.value)}</Text>
              </View>
              {ledgerEntry.description ? (
                <Text style={{ ...texts.xs, color: colors.black, marginTop: padding }}>
                  * {ledgerEntry.description}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
