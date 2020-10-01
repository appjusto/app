import React from 'react';
import { View, Text } from 'react-native';

import RoundedText from '../../../../common/components/texts/RoundedText';
import { colors, padding, texts } from '../../../../common/styles';

type Props = {
  title: string;
  formattedValue: string;
  description: string;
};

export default function ({ title, formattedValue, description }: Props) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: padding,
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ ...texts.medium }}>{title}</Text>
        <RoundedText>{formattedValue}</RoundedText>
      </View>
      <Text style={{ ...texts.default, color: colors.darkGrey }}>{description}</Text>
    </View>
  );
}
