import React from 'react';
import { View, ViewProps } from 'react-native';
import { colors } from '../../styles';

interface Props extends ViewProps {
  color?: string;
  height?: number;
}

export default function ({ color, height, style }: Props) {
  return <View style={[{ backgroundColor: color ?? colors.grey50, height: height ?? 1 }, style]} />;
}
