import { Fare, Order } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import HorizontalSelect from '../../../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { getOrderTotal } from '../../../../../common/store/api/order/helpers';
import { colors, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import SingleHeader from '../../../restaurants/SingleHeader';

type Props = {
  order: Order;
  selectedFare: Fare;
  selectedPlatformFee: number;
  platformFeeOptions: number[];
  onChangeFee: (value: number) => void;
};

export const OrderCostBreakdown = ({
  order,
  selectedFare,
  selectedPlatformFee,
  platformFeeOptions,
  onChangeFee,
}: Props) => {
  const options = platformFeeOptions.map((value) => ({
    id: `${value}`,
    title: formatCurrency(value),
    data: value,
  }));
  const selectedOption = options.find((option) => option.data === selectedPlatformFee);
  return (
    <View style={{ flex: 1 }}>
      <SingleHeader title={t('Entenda os valores')} />
      <PaddedView>
        <Text style={{ ...texts.small, color: colors.darkGrey }}>
          {t('Somos transparentes do início ao fim da entrega')}
        </Text>
        <View style={{ marginTop: padding }}>
          {!isEmpty(order.items) && (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Items do pedido')}</Text>
              <Text style={{ ...texts.default, lineHeight: 21 }}>
                {formatCurrency(getOrderTotal(order))}
              </Text>
            </View>
          )}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Entregador')}</Text>
            <Text style={{ ...texts.default, lineHeight: 21 }}>
              {formatCurrency(selectedFare?.courierFee ?? 0)}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Frota escolhida')}</Text>
            {/* find out how to display the fleet name below */}
            <Text style={{ ...texts.default, lineHeight: 21 }}>{selectedFare?.fleet.name}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {t('Impostos')}
            </Text>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {formatCurrency(selectedFare?.taxes ?? 0)}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {t('Tarifa financeira')}
            </Text>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {formatCurrency(selectedFare?.financialFee ?? 0)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <Text style={{ ...texts.default, lineHeight: 21 }}>{t('AppJusto')}</Text>
          <Text style={{ ...texts.default, lineHeight: 21 }}>
            {formatCurrency(selectedPlatformFee)}
          </Text>
        </View>
        <Text style={{ marginTop: padding, ...texts.small, color: colors.darkGrey }}>
          {t(
            'O AppJusto cobra menos para ser mais justo com todos. Você pode aumentar a sua contribuição se desejar.'
          )}
        </Text>
      </PaddedView>
      <View style={{ marginVertical: padding, marginLeft: padding }}>
        <HorizontalSelect
          data={options}
          selected={selectedOption}
          onSelect={(option) => onChangeFee(option.data)}
        />
      </View>
    </View>
  );
};
