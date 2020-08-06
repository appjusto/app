import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ButtonProps } from 'react-native';

import { colors, texts } from './styles';

export interface Props extends ButtonProps {
  styleObject?: object;
  wide?: boolean;
}

export default function ({ title, disabled, styleObject, wide, ...props }: Props) {
  return (
    <TouchableOpacity {...props}>
      <View
        style={{
          ...style.buttonContainer,
          backgroundColor: disabled ? colors.grey : colors.green,
          paddingHorizontal: wide ? 56 : 24,
          ...styleObject,
        }}
      >
        <Text style={{ ...style.text, color: disabled ? colors.white : colors.black }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 14.5,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center', //the container shrinks to the size of its content
  },
  text: {
    ...texts.default,
    fontSize: 16,
    lineHeight: 19,
    height: 19,
  },
});
