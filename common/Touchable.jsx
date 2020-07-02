import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

export default function (props) {
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    return <TouchableNativeFeedback {...props} />;
  }
  return <TouchableOpacity {...props} />;
}
