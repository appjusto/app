import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import * as fonts from '../../assets/fonts';
import { colors } from './styles';

export default function ({ title, disabled, style: externalStyle, ...props }) {
  return (
    <TouchableOpacity
      {...props}
    >
      <View
        style={{
          ...style.buttonContainer,
          ...externalStyle,
          backgroundColor: disabled ? colors.darkGrey : colors.green,
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
    alignSelf: 'center', //the container shrinks to the size of its content
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 19,
    height: 19,
  },
});
