import React from 'react';
import { View } from 'react-native';

import { colors } from '../../styles';

type Props = {
  tall?: boolean;
};

export default function ({ tall }: Props) {
  return (
    <View
      style={{ width: 4, height: tall ? 42 : 24, backgroundColor: colors.green, borderRadius: 8 }}
    />
  );
}
