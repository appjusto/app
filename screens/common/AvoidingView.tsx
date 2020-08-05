import { useHeaderHeight } from '@react-navigation/stack';
import React, { ReactNode } from 'react';
import { Platform, KeyboardAvoidingView, View, ViewProps } from 'react-native';

export interface Props extends ViewProps {
  children: ReactNode | ReactNode[];
}

export default function ({ children, ...props }: Props) {
  const headerHeight = useHeaderHeight();

  if (Platform.OS === 'ios')
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={headerHeight} {...props}>
        {children}
      </KeyboardAvoidingView>
    );

  return <View {...props}>{children}</View>;
}
