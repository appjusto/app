import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';

import { edit } from '../../../../assets/icons';
import { Order, Place } from '../../../../store/types';
import { t } from '../../../../strings';
import { texts, colors, borders } from '../../../common/styles';

export interface Props {
  order: Order;
  onEdit: (index: number) => void;
}

interface PlaceSummaryProps {
  place: Place;
  title: string;
  onEdit: () => void;
}

function PlaceSummary({ place, title, onEdit }: PlaceSummaryProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
      <View style={{ width: '60%', flex: 1 }}>
        <Text style={{ ...texts.small, lineHeight: 18, color: colors.darkGreen }}>{title}</Text>
        <Text style={{ ...texts.medium, lineHeight: 22 }}>{place.address}</Text>
        <Text>{place.additionalInfo}</Text>
        <Text>{place.description}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => onEdit()}>
          <Image style={{ width: 32, height: 32 }} source={edit} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ({ order, onEdit }: Props) {
  const { origin, destination, distance, duration, fare } = order;
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <PlaceSummary title={t(`Retirada`)} place={origin} onEdit={() => onEdit(0)} />
        <PlaceSummary title={t(`Entrega`)} place={destination} onEdit={() => onEdit(1)} />
        {/* <View style={{ flex: 1 }}>
          <Text>
            {t('Distância')}: {distance.text}
          </Text>
          <Text>
            {t('Estimativa de duração')}: {duration.text}
          </Text>
          <Text>
            {t('Valor da entrega R$')}: {fare.total}
          </Text>
        </View> */}
        <View
          style={{
            flex: 1,
            ...borders.default,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text>{distance.text}</Text>
          <Text>{duration.text}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
