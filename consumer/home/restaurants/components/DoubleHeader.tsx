import React from 'react';
import { Text, View } from 'react-native';
import Pill from '../../../../common/components/views/Pill';
import { colors, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  title: string;
  subtitle: string;
};

export default function ({ title, subtitle, ...props }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, flex: 1 }} {...props}>
      <Pill tall />
      <View style={{ marginLeft: 12 }}>
        <Text style={{ ...texts.mediumToBig, color: colors.black }}>{t(title)}</Text>
        <Text style={{ ...texts.small, color: colors.darkGrey }}>{t(subtitle)}</Text>
      </View>
    </View>
  );
}
