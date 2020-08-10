import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';

import { edit } from '../../../../assets/icons';
import { Order, Place } from '../../../../store/types';
import { t } from '../../../../strings';
import { texts, colors, borders, screens } from '../../../common/styles';

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
      <View style={{ alignSelf: 'center' }}>
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
        <View
          style={{
            ...borders.default,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Text>{distance.text}</Text>
          <Text>{duration.text}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 16,
            justifyContent: 'space-between',
            height: 60,
            width: '100%',
          }}
        >
          <Text style={{ ...texts.medium, lineHeight: 22 }}>{t('Valor total a pagar')}</Text>
          <Text style={{ ...texts.medium, lineHeight: 22 }}>R$ {fare.total}</Text>
        </View>
      </View>
      <View style={{ ...screens.lightGrey, paddingVertical: 24 }}>
        <View>
          <Text style={{ ...texts.default, lineHeight: 22 }}>{t('Entenda os valores')}</Text>
          <Text style={{ ...texts.small, lineHeight: 18, color: colors.darkGrey }}>
            {t('Somos transparentes do início ao fim da entrega')}
          </Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}
        >
          <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Entregador')}</Text>
          <Text style={{ ...texts.default, lineHeight: 21 }}>R$ {fare.courierFee}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            {t('Impostos')}
          </Text>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            R$ {fare.taxes}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            {t('Tarifa financeira')}
          </Text>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            R$ {fare.financialFee}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <Text style={{ ...texts.default, lineHeight: 21 }}>{t('AppJusto')}</Text>
          <Text style={{ ...texts.default, lineHeight: 21 }}>R$ {fare.platformFee} </Text>
        </View>
        <Text style={{ ...texts.small, lineHeight: 19, color: colors.darkGrey }}>
          O AppJusto cobra menos para ser mais justo com todos. Você pode aumentar a sua
          contribuição se desejar.
        </Text>
      </View>
    </ScrollView>
  );
}
