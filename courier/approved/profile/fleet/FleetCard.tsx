import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';

import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { Fleet } from '../../../../common/store/fleet/types';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { borders, texts, colors, padding } from '../../../../common/styles';
import { currencyFromCents, formatDistance } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  fleet: Fleet;
  selected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
};

export default function ({ fleet, selected, onSelect, onConfirm }: Props) {
  // app state
  const busy = useSelector(getUIBusy);

  // UI
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View
        style={[
          {
            ...borders.default,
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: padding,
            backgroundColor: colors.white,
          },
          selected
            ? {
                borderWidth: 2,
                borderColor: colors.green,
              }
            : null,
        ]}
      >
        <View>
          <Text style={{ ...texts.default }}>{fleet.name}</Text>
          <Text style={{ ...texts.small, marginTop: 4, color: colors.darkGreen }}>
            {fleet.participantsOnline} {t('participantes online')}
          </Text>
          <Text style={{ ...texts.small, marginTop: 12, height: 54, color: colors.darkGrey }}>
            {fleet.description}
          </Text>
          <View style={{ marginTop: padding }}>
            <RoundedText>{`${currencyFromCents(fleet.minimumFee)} ${t('até')} ${formatDistance(
              fleet.distanceThreshold
            )} + ${currencyFromCents(fleet.additionalPerKmAfterThreshold)} ${t(
              'por km adicional'
            )}`}</RoundedText>
          </View>
          {/* <View style={{ marginTop: padding }}>
            <RoundedText>{`${formatPct(fleet.feePctOverValue)} ${t(
              'para pedidos a partir de'
            )} ${currencyFromCents(fleet.valueThreshold)}`}</RoundedText>
          </View>
          <View style={{ marginTop: padding }}>
            <RoundedText>{`${t('Distância máxima até a origen: ')} ${formatDistance(
              fleet.maxDistanceToOrigin
            )}`}</RoundedText>
          </View>
          <View style={{ marginTop: padding }}>
            <RoundedText>{`${t('Distância máxima total: ')} ${formatDistance(
              fleet.maxDistance
            )}`}</RoundedText>
          </View> */}
        </View>
        <DefaultButton
          style={{ marginTop: padding }}
          title={t('Confirmar')}
          onPress={onConfirm}
          disabled={!selected}
          activityIndicator={busy && selected}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
