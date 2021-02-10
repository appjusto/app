import { Fleet } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../../../../common/components/texts/RoundedText';
import { borders, colors, halfPadding, padding, texts } from '../../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../../common/utils/formatters';
import { t } from '../../../../../../strings';

type Props = {
  fleet: Fleet;
  listItem?: boolean;
  onPress?: () => void;
};

export const CourierFleetCard = ({ fleet, listItem, onPress }: Props) => {
  return (
    <View
      style={{
        ...borders.default,
        paddingHorizontal: 12,
        paddingVertical: padding,
        backgroundColor: colors.white,
      }}
    >
      <Text style={{ ...texts.default }}>{fleet.name}</Text>
      <Text style={{ ...texts.small, marginTop: halfPadding, color: colors.darkGreen }}>
        {fleet.participantsOnline} {t('participantes online')}
      </Text>
      <Text
        style={{
          ...texts.small,
          marginTop: padding,
          color: colors.darkGrey,
          marginBottom: padding,
        }}
      >
        {fleet.description}
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
        <RoundedText>{formatCurrency(fleet.minimumFee)}</RoundedText>
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
        <RoundedText>{formatDistance(fleet.distanceThreshold)}</RoundedText>
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
        <RoundedText>{formatCurrency(fleet.additionalPerKmAfterThreshold)}</RoundedText>
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
          {formatDistance(fleet.maxDistance)}
        </RoundedText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ ...texts.small, color: colors.darkGrey }}>
          {t('Distância Máxima até a Origem')}
        </Text>
        <RoundedText color={colors.darkGrey} backgroundColor={colors.lightGrey} noBorder>
          {formatDistance(fleet.maxDistanceToOrigin)}
        </RoundedText>
      </View>
      {listItem && (
        <DefaultButton
          title={t('Detalhes da frota')}
          secondary
          style={{ marginTop: padding }}
          onPress={onPress}
        />
      )}
    </View>
  );
};
