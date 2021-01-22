import { Fleet, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../common/components/texts/RoundedText';
import { borders, colors, padding, texts } from '../../../common/styles';
import { formatCurrency, formatDistance } from '../../../common/utils/formatters';
import { t } from '../../../strings';

type Props = {
  fleet: WithId<Fleet>;
};

export default function ({ fleet }: Props) {
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
        <Text style={{ ...texts.default }}>{fleet?.name}</Text>
        <Text style={{ ...texts.small, marginTop: 4, color: colors.darkGreen }}>
          {fleet?.participantsOnline ?? 0} {t('participantes online')}
        </Text>
        <Text
          style={{
            ...texts.small,
            marginTop: 12,
            // height: 54,
            color: colors.darkGrey,
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
          <Text style={{ ...texts.small }}>{t('Pagamento Mínimo')}</Text>
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
          <Text style={{ ...texts.small }}>{t('Distância Inicial Mínima')}</Text>
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
          <Text style={{ ...texts.small }}>{t('Valor Adicional por Km rodado')}</Text>
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
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {t('Distância Máxima para Entrega')}
          </Text>
          <RoundedText color={colors.darkGrey} backgroundColor={colors.lightGrey} noBorder>
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
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {t('Distância Máxima até a Origem')}
          </Text>
          <RoundedText color={colors.darkGrey} backgroundColor={colors.lightGrey} noBorder>
            {fleet ? formatDistance(fleet.maxDistanceToOrigin) : '--'}
          </RoundedText>
        </View>
      </View>
    </View>
  );
}
