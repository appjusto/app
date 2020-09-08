import React from 'react';
import { TouchableOpacity, View, ButtonProps, Text } from 'react-native';

import { padding, colors, borders } from '../../../../common/styles';

interface Props extends ButtonProps {
  children: React.ReactNode;
  hasTitle: boolean;
}
export default function ({ children, title, onPress, hasTitle }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: 160,
          height: 160,
          backgroundColor: colors.lightGrey,
          ...borders.default,
          borderColor: colors.white,
          padding,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
        {hasTitle && <Text style={{ marginTop: padding }}>{title}</Text>}
      </View>
    </TouchableOpacity>
  );
}
