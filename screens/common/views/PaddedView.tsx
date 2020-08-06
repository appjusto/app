import React from 'react';
import { View, ViewProps } from 'react-native';

import { padding } from '../styles';

interface Props extends ViewProps {
  children: React.ReactNode;
}

export default function ({ children, style: externalStyle, ...props }: Props) {
  return (
    <View style={[{ padding }, externalStyle]} {...props}>
      {children}
    </View>
  );
}
