import React from 'react';
import { Text, View } from 'react-native';
import { borders, colors, padding, texts } from '../../../styles';

type Props = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  grey?: boolean;
  bgColor?: string;
  borderColor?: string;
};

export default function ({ title, subtitle, icon, grey, bgColor, borderColor }: Props) {
  return (
    <View
      style={{
        ...borders.default,
        borderColor: borderColor ? borderColor : grey ? colors.grey500 : colors.grey50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: bgColor ? bgColor : grey ? colors.grey50 : colors.white,
        padding,
      }}
    >
      {icon}
      <View style={{ marginLeft: padding, width: '75%' }}>
        <Text style={{ ...texts.sm }}>{title}</Text>
        <View>
          <Text
            style={{
              ...texts.xs,
              color: colors.grey700,
              flexWrap: 'wrap',
              width: '95%',
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
