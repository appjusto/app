import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { halfPadding, padding, texts } from '../../styles';
import Pill from '../views/Pill';

interface Props extends ViewProps {
  title: string;
  textTransform?: 'none' | 'capitalize';
}

export default function ({ title, textTransform = 'none' }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: halfPadding,
        width: '100%',
        paddingRight: padding,
      }}
    >
      <Pill />
      <Text
        style={{
          ...texts.md,
          ...texts.bold,
          marginLeft: 12,
          textTransform,
          flexWrap: 'wrap',
        }}
      >
        {title}
      </Text>
    </View>
  );
}
