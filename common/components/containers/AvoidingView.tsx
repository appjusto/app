import { useHeaderHeight } from '@react-navigation/stack';
import React, { ReactNode } from 'react';
import { Platform, KeyboardAvoidingView, View, ViewProps } from 'react-native';

export interface Props extends ViewProps {
  children: ReactNode | ReactNode[];
}

export default function ({ children, style, ...props }: Props) {
  const headerHeight = useHeaderHeight();

  if (Platform.OS === 'ios')
    return (
      <KeyboardAvoidingView
        style={[{ flex: 1, justifyContent: 'flex-end' }, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
        {...props}
      >
        {children}
      </KeyboardAvoidingView>
    );

  return (
    <View style={[{ flex: 1, justifyContent: 'flex-end' }, style]} {...props}>
      {children}
    </View>
  );
}
