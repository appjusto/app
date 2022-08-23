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
          {selectedFare?.courier?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Entrega')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.courier.value)}</Text>
            </View>
          ) : null}
          {selectedFare?.courier?.processing?.value && flavor === 'courier' ? (
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ ...texts.sm, color: colors.red }}>{t('Taxa Iugu *')}</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ ...texts.sm, color: colors.red }}>
                  {formatCurrency(selectedFare.courier.processing.value)}
                </Text>
              </View>
            </View>
          ) : null}
          {order.tip?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm }}>{t('Caixinha')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(order.tip.value)}</Text>
            </View>
          ) : null}
          {order.tip?.processing?.value && flavor === 'courier' ? (
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ ...texts.sm, color: colors.red }}>{t('Taxa Iugu *')}</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ ...texts.sm, color: colors.red }}>
                  {formatCurrency(order.tip.processing.value)}
                </Text>
              </View>
            </View>
          ) : null}
          {flavor === 'courier' ? (
            <View>
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
