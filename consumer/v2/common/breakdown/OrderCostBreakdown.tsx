import { Fare, Order } from '@appjusto/types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getOrderTotal } from '../../../../common/store/api/order/helpers';
import { colors, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  order: Order;
  selectedFare: Fare | undefined;
};

export const OrderCostBreakdown = ({ order, selectedFare }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <SingleHeader title={t('Entenda os valores')} />
      <PaddedView>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Somos transparentes do início ao fim da entrega')}
        </Text>
        <View style={{ marginTop: padding }}>
          {!isEmpty(order.items) && (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm, lineHeight: 21 }}>{t('Itens do pedido')}</Text>
              <Text style={{ ...texts.sm, lineHeight: 21 }}>
                {formatCurrency(getOrderTotal(order))}
              </Text>
            </View>
          )}
          {selectedFare?.platform?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm, lineHeight: 21 }}>{t('AppJusto')}</Text>
              <Text style={{ ...texts.sm, lineHeight: 21 }}>
                {formatCurrency(selectedFare.platform.value)}
              </Text>
            </View>
          ) : null}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.sm, lineHeight: 21 }}>{t('Entrega')}</Text>
            <Text style={{ ...texts.sm, lineHeight: 21 }}>
              {formatCurrency(selectedFare?.courier.value ?? 0)}
            </Text>
          </View>
          {order.tip?.value ? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.sm, lineHeight: 21 }}>{t('Caixinha entregador')}</Text>
              <Text style={{ ...texts.sm, lineHeight: 21 }}>
                {formatCurrency(order.tip!.value)}
              </Text>
            </View>
          ) : null}
        </View>
      </PaddedView>
    </View>
  );
};
