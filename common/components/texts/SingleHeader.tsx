import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { texts } from '../../styles';
import Pill from '../views/Pill';

interface Props extends ViewProps {
  title: string;
}

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
