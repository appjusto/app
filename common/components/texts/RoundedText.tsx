import React from 'react';
import { View, Image, Text } from 'react-native';

import { borders, texts, colors } from '../../styles';

type Props = {
  children: string;
  leftIcon?: any;
  color?: string;
  backgroundColor?: string;
};

export default function ({ leftIcon, color, backgroundColor: bg, children }: Props) {
  const tintColor = color ?? colors.black;
  const backgroundColor = bg ? bg : colors.white;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        ...borders.default,
        borderRadius: 32,
        borderColor: tintColor,
        backgroundColor,
      }}
    >
      {leftIcon && <Image source={leftIcon} style={{ tintColor, marginRight: 6 }} />}
      <Text style={[texts.small, { color: tintColor }]}>{children}</Text>
    </View>
  );
}
