import React from 'react';
import { Image, Text, View } from 'react-native';
import { borders, colors, texts } from '../../styles';

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
        // alignSelf: 'flex-start',
        alignItems: 'center',
        paddingBottom: 4,
        // height: 24,
        paddingHorizontal: 8,
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
