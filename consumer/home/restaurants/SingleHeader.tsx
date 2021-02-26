import React from 'react';
import { Text, View } from 'react-native';
import Pill from '../../../common/components/views/Pill';
import { halfPadding, padding, texts } from '../../../common/styles';

type Props = {
  title: string;
};

export default function ({ title }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: padding,
        marginBottom: halfPadding,
      }}
    >
      <Pill />
      <Text style={{ ...texts.md, ...texts.bold, marginLeft: 12 }}>{title}</Text>
    </View>
  );
}
