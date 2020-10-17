import React from 'react';
import { Image, Text, View } from 'react-native';

import { borders, colors, padding, texts } from '../../../styles';

type Props = {
  title: string;
  subtitle: string;
  icon: any;
};

export default function ({ title, subtitle, icon }: Props) {
  return (
    <View
      style={{
        ...borders.default,
        borderColor: colors.lightGrey,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.white,
        padding,
      }}
    >
      <Image source={icon} />
      <View style={{ marginLeft: padding }}>
        <Text style={{ ...texts.default }}>{title}</Text>
        <Text
          style={{
            ...texts.small,
            color: colors.darkGrey,
            flexWrap: 'wrap',
            maxWidth: '85%',
          }}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
