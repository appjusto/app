import React from 'react';
import { View, ViewProps } from 'react-native';

import { padding as defaultPadding } from '../styles';

interface Props extends ViewProps {
  children: React.ReactNode;
  vertical?: boolean;
  horizontal?: boolean;
  padding?: number;
  half?: boolean;
}

export default function ({
  children,
  vertical = true,
  horizontal = true,
  half = false,
  padding = defaultPadding,
  style: externalStyle,
  ...props
}: Props) {
  const viewPadding = !half ? padding : padding / 2;
  const styles = [
    vertical ? { paddingVertical: viewPadding } : null,
    horizontal ? { paddingHorizontal: viewPadding } : null,
    externalStyle,
  ];
  return (
    <View style={styles} {...props}>
      {children}
    </View>
  );
}
