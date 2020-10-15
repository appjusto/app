import React from 'react';
import { View, Text, StyleSheet, TextInputProps } from 'react-native';

import { borders, texts, colors } from '../../styles';

export interface Props extends TextInputProps {
  title: string;
  children?: React.ReactNode;
}

export default ({ title, children, style: externalStyle, ...props }: Props) => (
  <View style={[styles.container, externalStyle]}>
    <View>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.text} {...props}>
        {children}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    height: 60,
    ...borders.default,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  label: {
    ...texts.small,
    color: colors.darkGreen,
    paddingVertical: 2,
  },
  text: {
    ...texts.medium,
    color: colors.darkGrey,
  },
});
