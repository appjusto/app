import React from 'react';
import { Image, Text, View } from 'react-native';
import { borders, colors, halfPadding, texts } from '../../styles';

type Props = {
  children: string;
  leftIcon?: any;
  color?: string;
  backgroundColor?: string;
  noBorder?: boolean;
};

export default function ({ leftIcon, color, backgroundColor: bg, children, noBorder }: Props) {
  const tintColor = color ?? colors.black;
  const backgroundColor = bg ? bg : colors.white;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: halfPadding,
        ...borders.default,
        borderRadius: 32,
        borderColor: noBorder ? colors.lightGrey : tintColor,
        backgroundColor,
      }}
    >
      {leftIcon && <Image source={leftIcon} style={{ tintColor, marginRight: 6 }} />}
      <Text style={[texts.small, { color: tintColor }]}>{children}</Text>
    </View>
  );
}
