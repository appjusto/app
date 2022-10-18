import { Fare } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import { borders, colors, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';

interface Props {
  item: Fare;
  selectedFare: boolean;
  onFareSelect: (fare: Fare) => void;
  onFleetDetail: (fleetId: string) => void;
}

export const FleetListItem = ({ item, selectedFare, onFareSelect, onFleetDetail }: Props) => {
  // helpers
  const total = formatCurrency(item.courier?.value ?? 0);
  // UI
  return (
    <TouchableOpacity onPress={() => onFareSelect(item)}>
      <PaddedView
        style={{
          ...borders.default,
          backgroundColor: selectedFare ? colors.green100 : colors.grey50,
          ...borders.default,
          borderWidth: selectedFare ? 2 : undefined,
          borderColor: colors.black,
        }}
      >
        <Text style={[texts.lg, texts.bold]}>{item.fleet?.name}</Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View>
            <Text style={{ ...texts.sm, marginRight: 2 }}>{total}</Text>
          </View>
          <TouchableOpacity onPress={item.fleet ? () => onFleetDetail(item.fleet!.id) : () => null}>
            <RoundedText>{t('Ver detalhes')}</RoundedText>
          </TouchableOpacity>
        </View>
      </PaddedView>
    </TouchableOpacity>
  );
};
