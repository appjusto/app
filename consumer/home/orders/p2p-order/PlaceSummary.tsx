import { Place } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as icons from '../../../../assets/icons';
import ShowIf from '../../../../common/components/views/ShowIf';
import { texts, colors } from '../../../../common/styles';

type Props = {
  place: Place;
  title: string;
  editStepHandler?: () => void;
};

export default function ({ place, title, editStepHandler }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
      <View style={{ width: '60%', flex: 1 }}>
        <Text style={{ ...texts.small, lineHeight: 18, color: colors.darkGreen }}>{title}</Text>
        <Text style={{ ...texts.medium, lineHeight: 22 }}>{place.address?.description}</Text>
        <ShowIf test={!isEmpty(place.additionalInfo)}>
          {() => <Text>{place.additionalInfo}</Text>}
        </ShowIf>
        <Text>{place.intructions}</Text>
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
