import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles';

type Props = {
  tall?: boolean;
  yellow?: boolean;
};

export default function ({ tall, yellow }: Props) {
  return (
    <View
      style={{
        width: 4,
        height: tall ? 42 : 24,
        backgroundColor: yellow ? colors.darkYellow : colors.green500,
        borderRadius: 8,
      }}
    />
  );
}
