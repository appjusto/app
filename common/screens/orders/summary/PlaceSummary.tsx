import { Place } from '@appjusto/types';
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
};

export default function ({ place, title, onEdit }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ maxWidth: '90%' }}>
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
        <Text style={{ ...texts.xs, marginBottom: halfPadding, marginTop: 4 }}>
          {place.intructions}
        </Text>
      </View>
      {onEdit && (
        <View style={{ alignSelf: 'center', width: 32, height: 32 }}>
          <TouchableOpacity onPress={onEdit}>
            <Feather
              name="edit-3"
              size={14}
              style={{
                ...borders.default,
                borderColor: colors.grey50,
                padding: 8,
                width: 32,
                height: 32,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
