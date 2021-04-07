import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles';

type Props = {
  tall?: boolean;
  color?: string;
};

export default function ({ tall, color }: Props) {
  return (
    <View
      style={{
        width: 4,
        height: tall ? 42 : 24,
        backgroundColor: color ? color : colors.green500,
        borderRadius: 8,
      }}
    />
  );
}
