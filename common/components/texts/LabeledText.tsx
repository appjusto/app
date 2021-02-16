import React from 'react';
import { StyleSheet, Text, TextInputProps, View } from 'react-native';
import { borders, colors, texts } from '../../styles';

export interface Props extends TextInputProps {
  title: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default ({ title, children, style: externalStyle, disabled, ...props }: Props) => (
  <View
    style={[
      styles.container,
      externalStyle,
      { borderColor: disabled ? colors.grey700 : colors.grey500 },
    ]}
  >
    <View>
      <Text style={[styles.label, { color: disabled ? colors.grey700 : colors.green600 }]}>
        {title}
      </Text>
      <Text style={styles.text} {...props} numberOfLines={2}>
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
    ...texts.xs,
    color: colors.green600,
    paddingVertical: 2,
  },
  text: {
    ...texts.md,
    color: colors.grey700,
    flexWrap: 'wrap',
  },
});
