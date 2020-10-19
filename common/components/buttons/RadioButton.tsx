import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';

import * as icons from '../../../assets/icons';
import { halfPadding, texts } from '../../styles';

type Props = {
  title: string;
  checked?: boolean;
  onPress: () => void;
};

export default function ({ title, checked, onPress }: Props) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{ flexDirection: 'row', marginTop: halfPadding, alignItems: 'center' }}>
        <Image source={checked ? icons.circleActive : icons.circle} />
        <Text style={{ ...texts.small, marginLeft: halfPadding }}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
