import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { texts } from './styles';

const CheckField = ({ onPress, source, text, marginTop }) => {
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
        <Image source={source} style={{ height: 24, width: 24 }} />
      </TouchableOpacity>
      <Text style={{ ...texts.small, marginLeft: 8 }}>{text}</Text>
    </View>
  );
};

export default CheckField;
