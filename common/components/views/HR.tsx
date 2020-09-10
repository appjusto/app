import React from 'react';
import { View } from 'react-native';

import { colors } from '../../styles';

type Props = {
  color?: string;
};

export default function ({ color }: Props) {
  return <View style={{ backgroundColor: color ?? colors.lightGrey, height: 1 }} />;
}
