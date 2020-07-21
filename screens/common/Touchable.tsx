import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform, TouchableOpacityProps, TouchableNativeFeedbackProps } from 'react-native';

export interface Props extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  children: React.ReactElement;
}

export default function ({ children, ...props }: Props) {
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    return <TouchableNativeFeedback children={children} {...props} />;
  }
  return <TouchableOpacity children={children} {...props} />;
}
