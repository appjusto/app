import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';

interface AppButonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  bgColor: string;
  borderColor?: string;
  number?: string;
  numberColor?: string;
  numberBgColor?: string;
  textColor?: string;
}

export const ListFilterButton = ({
  title,
  disabled,
  style,
  bgColor,
  borderColor,
  textColor,
  number,
  numberColor,
  numberBgColor,
  ...props
}: AppButonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      {...props}
      style={[
        {
          flexDirection: 'row',
          ...borders.default,
          paddingVertical: 12,
          paddingHorizontal: padding,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: bgColor,
          borderColor: borderColor ? borderColor : bgColor,
        },
        style,
      ]}
    >
      {number ? (
        <View
          style={{
            height: 24,
            width: 24,
            borderRadius: 12,
            backgroundColor: numberBgColor ? numberBgColor : colors.grey50,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: halfPadding,
          }}
        >
          <Text style={{ ...texts.x2s, color: numberColor }}>{number}</Text>
        </View>
      ) : null}
      <Text style={{ ...texts.sm, color: textColor ? textColor : colors.black }}>{title}</Text>
    </TouchableOpacity>
  );
};
