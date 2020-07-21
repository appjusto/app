import React from 'react';
import { Order, Place } from '../../../../store/types';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { t } from '../../../../strings';
import { edit } from '../../../../assets/icons';
import Touchable from '../../../common/Touchable';

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
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <Text>{title}</Text>
        <Text>{place.address}</Text>
        <Text>{place.additionalInfo}</Text>
        <Text>{place.description}</Text>
      </View>
      <View>
        <Touchable onPress={() => onEdit()}>
          <Image style={{ width: 32, height: 32 }} source={edit} />
        </Touchable>
      </View>
    </View>
  );
}

export default function ({ order, onEdit }: Props) {
  const { places, distance, duration, fare } = order;
  const [origin, destination] = places;
  return (
    <ScrollView style={style.scroll}>

      <PlaceSummary
        title={t(`Retirada`)}
        place={origin}
        onEdit={() => onEdit(0)}
      />

      <PlaceSummary 
        title={t(`Entrega`)}
        place={destination}
        onEdit={() => onEdit(1)}
      />

      <Text>{t('Distância')}: {distance.text}</Text>
      <Text>{t('Estimativa de duração')}: {duration.text}</Text>
      <Text>{t('Valor da entrega R$')}: {fare.total}</Text>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  scroll: {
  }
})