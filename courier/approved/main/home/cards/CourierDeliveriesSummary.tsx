import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { IconRequestSmall } from '../../../../../common/icons/icon-requests-small';
import { useCourierRecentOrdersRevenue } from '../../../../../common/store/api/order/courier/useCourierRecentOrdersRevenue';
import { borders, colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

interface Props {
  onPress: () => void;
}

export const CourierDeliveriesSummary = ({ onPress }: Props) => {
  // state
  const revenue = useCourierRecentOrdersRevenue();
  // UI
  if (!revenue) return null;
  return (
    <TouchableOpacity onPress={onPress}>
      <PaddedView
        style={{
          ...borders.default,
          borderColor: colors.grey50,
          backgroundColor: colors.white,
          marginBottom: padding,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconRequestSmall />
          <View style={{ marginLeft: padding }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Hoje')}</Text>
                <Text style={{ ...texts.md, color: colors.black }}>
                  {formatCurrency(revenue.today)}
                </Text>
              </View>
              <View>
                <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Semana')}</Text>
                <Text style={{ ...texts.md, color: colors.black }}>
                  {formatCurrency(revenue.week)}
                </Text>
              </View>
            </View>
            <Text style={{ marginTop: halfPadding, ...texts.xs, color: colors.grey700 }}>
              {t('Veja todos os seus ganhos')}
            </Text>
          </View>
        </View>
      </PaddedView>
    </TouchableOpacity>
  );
};
