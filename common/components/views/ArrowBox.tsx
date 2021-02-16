import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { borders, colors } from '../../styles';

interface Props extends ViewProps {
  flipped?: boolean;
}

export default function ({ flipped, ...props }: Props) {
  return (
    <View style={styles.container} {...props}>
      <Feather name="arrow-right" style={flipped ? { transform: [{ scaleX: -1 }] } : null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 32,
    backgroundColor: colors.white,
    ...borders.default,
    borderColor: colors.grey50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
