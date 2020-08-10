import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { checkboxActive, checkboxInactive } from '../../assets/icons';
import { texts } from './styles';

export interface Props {
  onPress: () => void;
  text: string;
  marginTop?: number;
  checked?: boolean;
}

export default ({ onPress, text, marginTop = 0, checked = false }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 24,
          marginTop,
        }}
      >
        <Image
          source={checked ? checkboxActive : checkboxInactive}
          style={{ height: 24, width: 24 }}
        />
        <Text style={{ ...texts.small, marginLeft: 8 }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
