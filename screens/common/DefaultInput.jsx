import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { borders, texts, colors } from './styles';

export default ({ title, children, style: externalStyle, ...props }) => (
  <View style={[style.container, externalStyle]}>
    <View>
      <Text style={style.text}>{title}</Text>
      <TextInput {...props} />
    </View>
    {children}
  </View>
);

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    ...borders.default,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  text: {
    ...texts.default,
    color: colors.darkGreen,
    fontSize: 13,
    lineHeight: 16,
    paddingVertical: 2,
  },
});
