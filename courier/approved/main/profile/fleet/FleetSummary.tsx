import { FleetFareParams } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

export default function ({
  minimumFee,
  distanceThreshold,
  maxDistance,
  maxDistanceToOrigin,
}: FleetFareParams) {
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.sm, marginBottom: 4 }}>{t('Resumo da Frota')}</Text>
        <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 16 }}>
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
          <Text style={{ ...texts.sm }}>{t('Pagamento Mínimo')}</Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(minimumFee)}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.sm }}>{t('Distância Mínima')}</Text>
          <Text style={{ ...texts.sm }}>{formatDistance(distanceThreshold)}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('Distância Máxima para Entrega')}
          </Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>{formatDistance(maxDistance)}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('Distância Máxima até a Origem')}
          </Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {formatDistance(maxDistanceToOrigin)}
          </Text>
        </View>
      </PaddedView>
    </View>
  );
}
