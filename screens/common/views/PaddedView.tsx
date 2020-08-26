import React from 'react';
import { View, ViewProps } from 'react-native';

import { padding } from '../styles';

interface Props extends ViewProps {
  children: React.ReactNode;
  vertical?: boolean;
  horizontal?: boolean;
}

export default function ({
  children,
  vertical = true,
  horizontal = true,
  style: externalStyle,
  ...props
}: Props) {
  const styles = [
    vertical ? { paddingVertical: padding } : null,
    horizontal ? { paddingHorizontal: padding } : null,
    externalStyle,
  ];
  return (
    <View style={styles} {...props}>
      {children}
    </View>
  );
}
