import { Fare } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import { borders, colors, texts } from '../../../common/styles';
import { formatCurrency, separateWithDot } from '../../../common/utils/formatters';
import { t } from '../../../strings';

interface Props {
  item: Fare;
  selectedFare: boolean;
  onFareSelect: (fare: Fare) => void;
  onFleetDetail: (fleetId: string) => void;
}

export const FleetListItem = ({ item, selectedFare, onFareSelect, onFleetDetail }: Props) => {
  // helpers
  const total = formatCurrency(item.courier.value);
  const participants = item.fleet.participantsOnline;
  const participantsOnline = item.fleet.participantsOnline.toString();
  const description = (() => {
    if (participants === 1) return 'pessoa agora';
    else if (participants > 1) return 'pessoas agora';
  })();
  const text = separateWithDot(total, participantsOnline);
  // o que o componente deve receber/saber:
  // uma Fare (item)
  // uma função para selecionar essa frota/item específica
  // nome da frota - item.fleet.name
  // total de participantes online ????
  // valor da frota selecionada
  // uma função para ver os detalhes da frota
  return (
    <TouchableOpacity onPress={() => onFareSelect}>
      <PaddedView
        style={{
          ...borders.default,
          backgroundColor: selectedFare ? colors.green100 : colors.grey50,
          ...borders.default,
          borderWidth: selectedFare ? 2 : undefined,
          borderColor: colors.black,
        }}
      >
        <Text style={[texts.lg, texts.bold]}>{item.fleet.name}</Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View>
            <Text style={{ ...texts.sm, marginRight: 2 }}>
              {text} {description}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onFleetDetail(item.fleet.id)}>
            <RoundedText>{t('Ver detalhes')}</RoundedText>
          </TouchableOpacity>
        </View>
      </PaddedView>
    </TouchableOpacity>
  );
};
