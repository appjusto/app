import { Fare, Order } from '@appjusto/types';
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
  order: Order;
  selectedFare: Fare | undefined;
  hideItems?: boolean;
};

export const OrderCostBreakdown = ({ order, selectedFare, hideItems }: Props) => {
  const flavor = useSelector(getFlavor);
  return (
    <View style={{ flex: 1 }}>
      <SingleHeader title={t('Entenda os valores')} />
      <View style={{ paddingTop: halfPadding, paddingBottom: padding, paddingHorizontal: padding }}>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Somos transparentes do início ao fim da entrega')}
        </Text>
        <View style={{ marginTop: padding }}>
          {!isEmpty(order.items) && !hideItems ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Itens do pedido')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(getOrderTotal(order))}</Text>
            </View>
          ) : null}
          {selectedFare?.platform?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('AppJusto')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.platform.value)}</Text>
            </View>
          ) : null}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.sm }}>{t('Entrega')}</Text>
            <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare?.courier?.value ?? 0)}</Text>
          </View>
          {order.tip?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Caixinha entregador/a')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(order.tip!.value)}</Text>
            </View>
          ) : null}
          {flavor === 'courier' ? (
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ ...texts.sm, color: colors.red }}>{t('Taxa Iugu *')}</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ ...texts.sm, color: colors.red, justifyContent: 'flex-end' }}>
                  2.21%
                </Text>
              </View>
              <Text style={{ ...texts.xs, color: colors.red, marginTop: padding }}>
                {t(
                  '* Essa taxa é descontada do valor de cada corrida aceita para efetuar a transação bancária na sua conta. Nada desse valor fica para o AppJusto.'
                )}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
