import { Fare } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { FlatList, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';

type Props = {
  data: Fare[];
};

export default function ({ data }: Props) {
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item.fleet.id!}
      renderItem={({ item }) => {
        return (
          <TouchableHighlight onPress={() => setSelectedFare(item)}>
            <PaddedView
              style={{
                width: 156,
                backgroundColor:
                  selectedFare?.fleet.id === item.fleet.id ? colors.lightGreen : colors.white,
                ...borders.default,
                borderWidth: 2,
                borderColor: colors.black,
                marginRight: halfPadding,
              }}
            >
              <Text numberOfLines={2} style={[texts.default, texts.bold]}>
                {item.fleet.name}
              </Text>
              <Text style={[texts.small, { marginTop: padding }]}>{t('Entregadores')}</Text>
              <Text style={[texts.small, texts.bold]}>
                {`${participantsOnlineByFleet[item.fleet.id] ?? 0} ${t('ativos agora')}`}
              </Text>
              <Text style={[texts.mediumToBig, texts.bold, { marginTop: padding }]}>
                {formatCurrency(item.total)}
              </Text>
              <TouchableOpacity onPress={() => navigateFleetDetail(item.fleet)}>
                <View style={{ marginTop: padding }}>
                  <RoundedText>{t('Ver detalhes')}</RoundedText>
                </View>
              </TouchableOpacity>
            </PaddedView>
          </TouchableHighlight>
        );
      }}
      horizontal
    />
  );
}
