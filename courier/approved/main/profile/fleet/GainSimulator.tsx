import React from 'react';
import { View, Text } from 'react-native';

import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

type Props = {
  fee: number;
  distance: number;
};

//MATH NEEDS TO BE CORRECTED (FEES)

export default function ({ fee, distance }: Props) {
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.default, marginBottom: 4 }}>{t('Simulação de ganhos')}</Text>
        <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: 16 }}>
          {t(
            'Veja uma simulação aproximada dos ganhos por corrida nessa frota com os valores definidos acima. Essa simulação não considera a Porcentagem do Valor do Pedido, então os ganhos finais podem ser superiores.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Text style={{ ...texts.default }}>{t('Distância percorrida por entrega')}</Text>
          <Text style={{ ...texts.default, ...texts.bold }}>{t('Ganhos')}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(distance)}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(fee)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(distance + 2000)}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(fee * 1.66)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(distance + 4000)}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(fee * 2.33)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(distance + 6000)}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(fee * 3)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(distance + 8000)}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(fee * 3.66)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(distance + 10000)}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(fee * 4.33)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(distance + 12000)}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(fee * 5)}</Text>
        </View>
      </PaddedView>
    </View>
  );
}
