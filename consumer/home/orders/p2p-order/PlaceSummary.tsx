import { Place } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as icons from '../../../../assets/icons';
import ShowIf from '../../../../common/components/views/ShowIf';
import { texts, colors } from '../../../../common/styles';

type Props = {
  place: Partial<Place>;
  title: string;
  editStepHandler?: () => void;
};

export default function ({ place, title, editStepHandler }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ width: '60%' }}>
        <Text style={{ ...texts.small, color: colors.darkGreen }}>{title}</Text>
        <Text style={{ ...texts.medium }}>{place.address?.main ?? ''}</Text>
        <Text style={{ ...texts.default }}>{place.address?.secondary ?? ''}</Text>
        <ShowIf test={!isEmpty(place.additionalInfo)}>
          {() => <Text style={{ ...texts.small }}>{place.additionalInfo}</Text>}
        </ShowIf>
        <Text style={{ ...texts.small }}>{place.intructions}</Text>
      </View>
      <ShowIf test={editStepHandler !== undefined}>
        {() => (
          <View style={{ alignSelf: 'center' }}>
            <TouchableOpacity onPress={editStepHandler}>
              <Image style={{ width: 32, height: 32 }} source={icons.edit} />
            </TouchableOpacity>
          </View>
        )}
      </ShowIf>
    </View>
  );
}
