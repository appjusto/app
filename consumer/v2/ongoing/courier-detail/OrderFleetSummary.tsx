import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import useObserveFleet from '../../../../common/store/api/fleet/hooks/useObserveFleet';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  fleetId: string;
};

export const OrderFleetSummary = ({ fleetId }: Props) => {
  // state
  const fleet = useObserveFleet(fleetId);
  // UI
  return (
    <View
      style={{
        ...borders.default,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: padding,
        backgroundColor: colors.white,
      }}
    >
      <View>
        <Text style={{ ...texts.sm }}>{fleet?.name}</Text>
        <Text style={{ ...texts.xs, marginTop: 4, color: colors.green600 }}>
          {fleet?.participantsOnline ?? 0} {t('participantes online')}
        </Text>
        <Text
          style={{
            ...texts.xs,
            marginTop: 12,
            // height: 54,
            color: colors.grey700,
            marginBottom: 20,
          }}
        >
          {fleet?.description}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ ...texts.xs }}>{t('Pagamento Mínimo')}</Text>
          <RoundedText>{fleet ? formatCurrency(fleet.minimumFee) : '--'}</RoundedText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ ...texts.xs }}>{t('Distância Inicial Mínima')}</Text>
          <RoundedText>{fleet ? formatDistance(fleet.distanceThreshold) : '--'}</RoundedText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ ...texts.xs }}>{t('Valor Adicional por Km rodado')}</Text>
          <RoundedText>
            {fleet ? formatCurrency(fleet.additionalPerKmAfterThreshold) : '--'}
          </RoundedText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t('Distância Máxima para Entrega')}
          </Text>
          <RoundedText color={colors.grey700} backgroundColor={colors.grey50} noBorder>
            {fleet ? formatDistance(fleet.maxDistance) : '--'}
          </RoundedText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t('Distância Máxima até a Origem')}
          </Text>
          <RoundedText color={colors.grey700} backgroundColor={colors.grey50} noBorder>
            {fleet ? formatDistance(fleet.maxDistanceToOrigin) : '--'}
          </RoundedText>
        </View>
      </View>
    </View>
  );
};
