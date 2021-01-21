import React from 'react';
import { Text, View } from 'react-native';
import Pill from '../../../common/components/views/Pill';
import { halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

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
      <Text style={{ ...texts.medium, ...texts.bold, marginLeft: 12 }}>{t(title)}</Text>
    </View>
  );
}
