import React from 'react';
import { View, Text } from 'react-native';

import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatDistance, formatPct } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

type Props = {
  minimumFee: number;
  distanceThreshold: number;
  maxDistance: number;
  maxDistanceToOrigin: number;
  feePctOverValue: number;
  valueThreshold: number;
};

export default function ({
  minimumFee,
  distanceThreshold,
  maxDistance,
  maxDistanceToOrigin,
  feePctOverValue,
  valueThreshold,
}: Props) {
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.default, marginBottom: 4 }}>{t('Resumo da Frota')}</Text>
        <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: 16 }}>
          {t('Revise as informações antes de criar essa frota')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.default }}>{t('Pagamento Mínimo')}</Text>
          <Text style={{ ...texts.default }}>{formatCurrency(minimumFee)}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.default }}>{t('Distância Mínima')}</Text>
          <Text style={{ ...texts.default }}>{formatDistance(distanceThreshold)}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('Distância Máxima para Entrega')}
          </Text>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(maxDistance)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('Distância Máxima até a Origem')}
          </Text>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatDistance(maxDistanceToOrigin)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('Porcentagem do Valor do Pedido')}
          </Text>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatPct(feePctOverValue)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('Valor Mínimo para Porcentagem')}
          </Text>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {formatCurrency(valueThreshold)}
          </Text>
        </View>
      </PaddedView>
    </View>
  );
}
