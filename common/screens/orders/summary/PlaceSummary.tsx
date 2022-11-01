import { Fulfillment, Place } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { borders, colors, halfPadding, texts } from '../../../styles';
import { formatAddress } from '../../../utils/formatters';

type Props = {
  place: Partial<Place>;
  title: string;
  onEdit?: () => void;
  fulfillment?: Fulfillment;
};

export default function ({ place, title, onEdit, fulfillment }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ maxWidth: '90%', marginBottom: halfPadding }}>
        <Text style={{ ...texts.xs, color: colors.green600 }}>{title}</Text>
        <Text style={{ ...texts.md, marginTop: 4 }} numberOfLines={2}>
          {formatAddress(place.address!)}
        </Text>
        {place.address?.secondary && (
          <Text style={{ ...texts.sm, marginTop: 4 }}>{place.address?.secondary ?? ''}</Text>
        )}
        {!isEmpty(place.additionalInfo) && (
          <Text style={{ ...texts.xs, marginTop: 4 }}>{place.additionalInfo}</Text>
        )}
        {place.instructions && fulfillment === 'take-away' ? (
          <Text style={{ ...texts.xs, marginBottom: halfPadding, marginTop: 4 }}>
            {place.instructions}
          </Text>
        ) : null}
        {place.intructions ? (
          <Text style={{ ...texts.xs, marginTop: 4 }}>{place.intructions}</Text>
        ) : null}
      </View>
      {onEdit && (
        <View style={{ alignSelf: 'center', width: 32, height: 32 }}>
          <TouchableOpacity onPress={onEdit}>
            <Feather
              name="edit-3"
              size={12}
              style={{
                ...borders.default,
                borderColor: colors.grey50,
                padding: 8,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
