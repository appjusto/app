import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../../../common/components/texts/RoundedText';
import { colors, halfPadding, texts } from '../../../../../../common/styles';

interface Props {
  text: string;
  variant?: 'yellow' | 'light-red';
}

export const ItemTag = ({ text, variant }: Props) => {
  let backgroundColor = colors.green100;
  if (variant === 'yellow') backgroundColor = colors.darkYellow;
  else if (variant === 'light-red') backgroundColor = colors.red50;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          ...texts.x2l,
          marginLeft: halfPadding,
          left: -2,
          top: -2,
        }}
      >
        {'\u00B7'}
      </Text>
      <RoundedText
        style={{ marginLeft: halfPadding }}
        backgroundColor={backgroundColor}
        color={colors.black}
        noBorder
      >
        {text}
      </RoundedText>
    </View>
  );
};
