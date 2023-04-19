import React from 'react';
import { Text, View } from 'react-native';
import { colors, texts } from '../../../../common/styles';

type Props = {
  title: string;
  subtitle: string;
  secondary?: boolean;
};

export const DoubleHeaderV3 = ({ title, subtitle, secondary, ...props }: Props) => {
  return (
    <View>
      <Text style={{ ...texts.x2l, color: secondary ? colors.grey700 : colors.black }}>
        {title}
      </Text>
      <Text style={{ ...texts.xs, color: colors.grey700 }}>{subtitle}</Text>
    </View>
  );
};
