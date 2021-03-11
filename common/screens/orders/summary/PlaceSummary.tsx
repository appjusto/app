import { Feather } from '@expo/vector-icons';
import { Place } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { borders, colors, texts } from '../../../styles';
import { formatAddress } from '../../../utils/formatters';

type Props = {
  place: Partial<Place>;
  title: string;
  onEdit?: () => void;
};

export default function ({ place, title, onEdit }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
        <Text style={{ ...texts.xs, color: colors.green600 }}>{title}</Text>
        <Text style={{ ...texts.md }}>{formatAddress(place.address!)}</Text>
        {place.address?.secondary && (
          <Text style={{ ...texts.sm }}>{place.address?.secondary ?? ''}</Text>
        )}
        {!isEmpty(place.additionalInfo) && (
          <Text style={{ ...texts.xs }}>{place.additionalInfo}</Text>
        )}
        <Text style={{ ...texts.xs }}>{place.intructions}</Text>
      </View>
      {onEdit && (
        <View style={{ alignSelf: 'center' }}>
          <TouchableOpacity onPress={onEdit}>
            <Feather
              name="edit-3"
              size={12}
              style={{ ...borders.default, borderColor: colors.grey50, padding: 8 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
