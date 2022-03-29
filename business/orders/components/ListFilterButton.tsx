import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';

interface AppButonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  total: number;
  numberColor?: string;
  numberBgColor?: string;
  selected?: boolean;
}

export const ListFilterButton = ({
  title,
  disabled,
  style,
  total,
  numberColor,
  numberBgColor,
  selected,
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
          backgroundColor: selected ? colors.green100 : colors.white,
          borderColor: selected ? colors.black : colors.grey700,
        },
        style,
      ]}
    >
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
        <Text style={{ ...texts.x2s, color: numberColor }}>{total}</Text>
      </View>
      <Text style={{ ...texts.sm, color: selected ? colors.black : colors.grey700 }}>{title}</Text>
    </TouchableOpacity>
  );
};
