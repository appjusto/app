import React from 'react';
import { View } from 'react-native';

import { colors } from '../../styles';

type Props = {
  color?: string;
  height?: number;
};

export default function ({ color, height }: Props) {
  return <View style={{ backgroundColor: color ?? colors.lightGrey, height: height ?? 1 }} />;
}
