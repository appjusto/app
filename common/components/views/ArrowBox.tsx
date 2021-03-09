import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { borders, colors } from '../../styles';

interface Props extends ViewProps {
  flipped?: boolean;
}

export default function ({ flipped, style, ...props }: Props) {
  return (
    <View
      style={[
        {
          height: 32,
          width: 32,
          backgroundColor: colors.white,
          ...borders.default,
          borderColor: colors.grey50,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...props}
    >
      {flipped ? <Feather size={16} name="arrow-left" /> : <Feather size={16} name="arrow-right" />}
    </View>
  );
}
