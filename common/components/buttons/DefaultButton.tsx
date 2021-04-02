import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { borders, colors, padding, texts } from '../../styles';

export interface DefaultButtonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  activityIndicator?: boolean;
  icon?: React.ReactNode;
  secondary?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export default function ({
  title,
  activityIndicator = false,
  icon,
  secondary = false,
  disabled,
  style,
  children,
  ...props
}: DefaultButtonProps) {
  const backgroundColor = secondary
    ? colors.white
    : disabled || activityIndicator
    ? colors.grey500
    : colors.green500;
  const borderColor =
    disabled || activityIndicator ? colors.grey500 : secondary ? colors.black : colors.green500;
  const color = disabled ? (secondary ? colors.grey500 : colors.grey700) : colors.black;

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
        {!activityIndicator && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ ...texts.sm, color }}>{title}</Text>
            {icon}
          </View>
        )}
        {activityIndicator && (
          <ActivityIndicator size="small" color={secondary ? colors.black : colors.white} />
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
}
