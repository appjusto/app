import React from 'react';
import { Text, View } from 'react-native';
import { texts } from '../../styles';
import Pill from '../views/Pill';

type Props = {
  title: string;
};

export default function ({ title }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Pill />
      <Text style={{ ...texts.md, ...texts.bold, marginLeft: 12 }}>{title}</Text>
    </View>
  );
}
