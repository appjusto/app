import React from 'react';
import { View, Image, StyleSheet, ViewProps } from 'react-native';

import { buttonArrow } from '../../../assets/icons';
import { colors, borders } from '../../styles';

interface Props extends ViewProps {
  flipped?: boolean;
}

export default function ({ flipped, ...props }: Props) {
  return (
    <View style={styles.container} {...props}>
      <Image source={buttonArrow} style={flipped ? { transform: [{ scaleX: -1 }] } : null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 32,
    backgroundColor: colors.white,
    ...borders.default,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
