import { Fare } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import SingleHeader from '../restaurants/SingleHeader';

type Props = {
  selectedFare: Fare;
  platformFee: HorizontalSelectItem;
  platformFeeOptions: HorizontalSelectItem[];
  onContribution: (value: HorizontalSelectItem) => void;
};

export default function ({ selectedFare, platformFee, platformFeeOptions, onContribution }: Props) {
  return (
    <View style={{ ...screens.default }}>
      <SingleHeader title="Entenda os valores" />
      <PaddedView>
        <Text style={{ ...texts.small, color: colors.darkGrey }}>
          {t('Somos transparentes do início ao fim da entrega')}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Entregador')}</Text>
          <Text style={{ ...texts.default, lineHeight: 21 }}>
            {formatCurrency(selectedFare?.courierFee ?? 0)}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Frota escolhida')}</Text>
          {/* find out how to display the fleet name below */}
          <Text style={{ ...texts.default, lineHeight: 21 }}>App Justo</Text>
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
            {formatCurrency(platformFee.data)}
          </Text>
        </View>
        <Text style={{ marginTop: padding, ...texts.small, color: colors.darkGrey }}>
          O AppJusto cobra menos para ser mais justo com todos. Você pode aumentar a sua
          contribuição se desejar.
        </Text>
      </PaddedView>
      <View style={{ marginVertical: padding, marginLeft: padding }}>
        <HorizontalSelect
          data={platformFeeOptions}
          selected={platformFee}
          onSelect={onContribution}
        />
      </View>
    </View>
  );
}
