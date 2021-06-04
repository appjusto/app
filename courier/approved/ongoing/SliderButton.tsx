import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';

export interface DefaultButtonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  activityIndicator?: boolean;
  bgColor: string;
  border: string;
}

export default function ({
  title,
  activityIndicator = false,
  disabled,
  bgColor = colors.green500,
  border = colors.green500,
  style,
  ...props
}: DefaultButtonProps) {
  const backgroundColor = disabled || activityIndicator ? colors.grey500 : bgColor;
  const borderColor = disabled || activityIndicator ? colors.grey500 : border;
  const color = disabled ? colors.grey700 : colors.black;

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
            backgroundColor,
            borderColor,
          },
          style,
        ]}
      >
        {!activityIndicator ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ ...texts.sm, color }}>{title}</Text>
            <Feather name="arrow-right" size={14} style={{ marginLeft: halfPadding }} />
          </View>
        ) : (
          <ActivityIndicator size="small" color={colors.white} />
        )}
      </View>
    </TouchableOpacity>
  );
}
