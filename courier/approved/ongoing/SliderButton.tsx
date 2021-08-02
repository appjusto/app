import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { borders, colors, padding, texts } from '../../../common/styles';

export interface DefaultButtonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  activityIndicator?: boolean;
  buttonColor: string;
}

export default function ({
  title,
  activityIndicator = false,
  disabled,
  buttonColor = colors.green500,
  style,
  ...props
}: DefaultButtonProps) {
  const backgroundColor = disabled || activityIndicator ? colors.grey500 : buttonColor;
  const borderColor = disabled || activityIndicator ? colors.grey500 : buttonColor;
  const color = disabled ? colors.grey700 : colors.black;

  return (
    <TouchableOpacity disabled={disabled} {...props}>
      <View
        style={[
          {
            flexDirection: 'row',
            ...borders.default,
            paddingHorizontal: padding,
            paddingVertical: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
            borderColor,
          },
          style,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...texts.sm, color }}>{title}</Text>
          <Feather name="arrow-right" size={14} style={{ marginLeft: 4, paddingTop: 4 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
