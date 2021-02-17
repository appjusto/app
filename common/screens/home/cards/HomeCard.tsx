import React from 'react';
import { Image, Text, View } from 'react-native';
import { borders, colors, padding, texts } from '../../../styles';

type Props = {
  title: string;
  subtitle: string;
  icon: any;
  grey?: boolean;
};

export default function ({ title, subtitle, icon, grey }: Props) {
  return (
    <View
      style={{
        ...borders.default,
        borderColor: grey ? colors.grey500 : colors.grey50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: grey ? colors.grey50 : colors.white,
        padding,
      }}
    >
      <Image source={icon} />
      <View style={{ marginLeft: padding }}>
        <Text style={{ ...texts.sm }}>{title}</Text>
        <Text
          style={{
            ...texts.xs,
            color: colors.grey700,
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
