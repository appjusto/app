import { Place } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../../assets/icons';
import ShowIf from '../../../../common/components/views/ShowIf';
import { colors, texts } from '../../../../common/styles';

type Props = {
  place: Partial<Place>;
  title: string;
  fullAdress?: boolean;
  editStepHandler?: () => void;
};

export default function ({ place, title, editStepHandler, fullAdress }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
        <Text style={{ ...texts.small, color: colors.darkGreen }}>{title}</Text>
        <Text style={{ ...texts.medium }}>{place.address?.main ?? ''}</Text>
        <ShowIf test={fullAdress}>
          {() => <Text style={{ ...texts.default }}>{place.address?.secondary ?? ''}</Text>}
        </ShowIf>
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
