import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { borders, padding, texts } from '../../../common/styles';

interface Props extends TouchableOpacityProps, ViewProps {
  title: string;
  bgColor: string;
  textColor: string;
}

export const CustomButton = ({ title, bgColor, textColor, disabled, style, ...props }: Props) => {
  return (
    <TouchableOpacity disabled={disabled} {...props}>
      <View
        style={[
          {
            flexDirection: 'row',
            ...borders.default,
            paddingHorizontal: padding,
            paddingVertical: 14,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: bgColor,
            borderColor: bgColor,
          },
          style,
        ]}
      >
        <Text style={{ ...texts.sm, color: textColor }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
