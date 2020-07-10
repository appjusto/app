import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import * as fonts from '../../assets/fonts';
import { colors } from './styles';

export default function RegularButton({ title, disabled, wide, ...props }) {
  return (
    <TouchableOpacity
      {...props}
    >
      <View
        style={{
          ...styles.buttonContainer,
          backgroundColor: disabled ? colors.darkGrey : colors.green,
          paddingHorizontal: wide ? 56 : 24
        }}
      >
        <Text style={{ ...styles.text, color: disabled ? colors.white : colors.black }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
