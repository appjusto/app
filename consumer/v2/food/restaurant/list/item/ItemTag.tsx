import React from 'react';
import { View } from 'react-native';
import RoundedText from '../../../../../../common/components/texts/RoundedText';
import { colors } from '../../../../../../common/styles';
import { ItemBullet } from './ItemBullet';

interface Props {
  text: string;
  variant?: 'yellow' | 'light-red' | 'grey';
}

export const ItemTag = ({ text, variant }: Props) => {
  let backgroundColor = colors.green100;
  if (variant === 'yellow') backgroundColor = colors.darkYellow;
  else if (variant === 'light-red') backgroundColor = colors.red50;
  else if (variant === 'grey') backgroundColor = colors.grey50;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ItemBullet />
      <RoundedText backgroundColor={backgroundColor} color={colors.black} noBorder>
        {text}
      </RoundedText>
    </View>
  );
};
