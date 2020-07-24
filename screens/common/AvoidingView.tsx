import React, { ReactNode } from "react";
import { Platform, KeyboardAvoidingView, View, ViewProps } from "react-native";


export interface Props extends ViewProps {
  children: ReactNode | ReactNode[];
}

export default function ({ children, ...props }: Props) {
  if (Platform.OS === 'ios') return (
    <KeyboardAvoidingView
      behavior="padding"
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );

  return (
    <View {...props}>
      {children}
    </View>
  );
}