import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ViewProps } from 'react-native';

export interface Props extends ViewProps {
  children: ReactNode | ReactNode[];
}

export default function ({ children, style, ...props }: Props) {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1, justifyContent: 'flex-end' }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -92}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
