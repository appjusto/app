import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';

import { texts } from './styles';
import { checkboxActive, checkboxInactive } from '../../assets/icons';

export interface Props {
  onPress: () => void;
  text: string;
  marginTop?: number;
  checked?: boolean;
}

export default ({ onPress, text, marginTop = 0, checked = false }: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        marginTop: marginTop,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Image source={checked ? checkboxActive : checkboxInactive} style={{ height: 24, width: 24 }} />
      </TouchableOpacity>
      <Text style={{ ...texts.small, marginLeft: 8 }}>{text}</Text>
    </View>
  );
};
