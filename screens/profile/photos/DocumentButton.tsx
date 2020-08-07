import React from 'react';
import { TouchableOpacity, View, ButtonProps, Text } from 'react-native';

import { padding, colors, borders } from '../../common/styles';

interface Props extends ButtonProps {
  children: React.ReactNode;
}
export default function ({ children, title, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: 160,
          height: 160,
          backgroundColor: colors.white,
          ...borders.default,
          padding,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.lightGrey,
            ...borders.default,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </View>
        <Text style={{ marginTop: padding }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
