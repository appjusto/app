import React from 'react';
import { Text, TextProps, View } from 'react-native';
import { borders, colors, halfPadding, texts } from '../../styles';

interface Props extends TextProps {
  children: string | number;
  color?: string;
  backgroundColor?: string;
  leftIcon?: React.ReactNode;
  noBorder?: boolean;
  quote?: boolean;
}

export default function ({
  color,
  backgroundColor: bg,
  children,
  leftIcon,
  noBorder,
  quote,
  style,
  ...props
}: Props) {
  const tintColor = color ?? colors.black;
  return (
    <View>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingVertical: 4,
            paddingHorizontal: halfPadding,
            ...borders.default,
            borderRadius: 32,
            borderColor: noBorder ? colors.grey50 : quote ? colors.green500 : tintColor,
            backgroundColor: bg ?? colors.white,
          },
          style,
        ]}
        {...props}
      >
        {leftIcon}
        <Text style={[texts.xs, { textAlign: 'center', color: tintColor, paddingBottom: 2 }]}>
          {children}
        </Text>
      </View>
    </View>
  );
}
