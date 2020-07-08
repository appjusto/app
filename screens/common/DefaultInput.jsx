import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { borders, texts, colors } from './styles';

export default ({ title, children, ...props }) => (
  <View style={styles.container}>
    <View style={styles.inputContainer}>
      <Text style={styles.text}>{title}</Text>
      <TextInput {...props} />
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 61,
    ...borders.default,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  inputContainer: {},
  text: {
    ...texts.default,
    color: colors.darkGreen,
    fontSize: 13,
    lineHeight: 16,
    paddingVertical: 2,
  },
});
