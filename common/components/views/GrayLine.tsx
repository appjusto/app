import React from 'react';
import { View } from 'react-native';
import { colors, padding } from '../../styles';

export default function () {
  return (
    <View
      style={{
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        borderStyle: 'solid',
        marginBottom: padding,
      }}
    />
  );
}
