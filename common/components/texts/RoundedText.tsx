import React from 'react';
import { View, Image, Text } from 'react-native';

import { borders, texts, colors } from '../../styles';

type Props = {
  text: string;
  leftIcon?: any;
  color?: string;
};

export default function ({ text, leftIcon, color, ...props }: Props) {
  const tintColor = color ?? colors.black;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        padding: 6,
        ...borders.default,
        ...borders.rounder,
        borderColor: tintColor,
      }}
    >
      {leftIcon && <Image source={leftIcon} style={{ tintColor, marginRight: 6 }} />}
      <Text style={[texts.small, { color: tintColor }]}>{text}</Text>
    </View>
  );
}
