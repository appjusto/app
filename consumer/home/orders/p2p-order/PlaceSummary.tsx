import { Feather } from '@expo/vector-icons';
import { Place } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ShowIf from '../../../../common/components/views/ShowIf';
import { borders, colors, texts } from '../../../../common/styles';
import { formatAddress } from '../../../../common/utils/formatters';

type Props = {
  place: Partial<Place>;
  title: string;
  onEdit?: () => void;
};

export default function ({ place, title, onEdit }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
        <Text style={{ ...texts.small, color: colors.darkGreen }}>{title}</Text>
        <Text style={{ ...texts.medium }}>{formatAddress(place.address!)}</Text>
        <ShowIf test={Boolean(place.address?.secondary)}>
          {() => <Text style={{ ...texts.default }}>{place.address?.secondary ?? ''}</Text>}
        </ShowIf>
        <ShowIf test={!isEmpty(place.additionalInfo)}>
          {() => <Text style={{ ...texts.small }}>{place.additionalInfo}</Text>}
        </ShowIf>
        <Text style={{ ...texts.small }}>{place.intructions}</Text>
      </View>
      <ShowIf test={Boolean(onEdit)}>
        {() => (
          <View style={{ alignSelf: 'center' }}>
            <TouchableOpacity onPress={onEdit}>
              <Feather
                name="edit-3"
                size={12}
                style={{ ...borders.default, borderColor: colors.lightGrey, padding: 8 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </ShowIf>
    </View>
  );
}
