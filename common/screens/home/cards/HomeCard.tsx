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
        borderColor: grey ? colors.grey : colors.lightGrey,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: grey ? colors.lightGrey : colors.white,
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
