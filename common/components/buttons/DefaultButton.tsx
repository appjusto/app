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
  grey?: boolean;
}

export default function ({
  title,
  activityIndicator = false,
  icon,
  secondary = false,
  disabled,
  style,
  children,
  grey,
  ...props
}: DefaultButtonProps) {
  const backgroundColor = (() => {
    if (secondary) return colors.white;
    else if (disabled || activityIndicator) return colors.grey500;
    else if (grey) return colors.grey700;
    else return colors.green500;
  })();
  const borderColor = (() => {
    if (disabled || activityIndicator) return colors.grey500;
    else if (secondary) return colors.black;
    else if (grey) return colors.grey700;
    else return colors.green500;
  })();
  const color = (() => {
    if (disabled) {
      if (secondary) return colors.grey500;
      else return colors.grey700;
    } else if (grey) {
      return colors.white;
    } else return colors.black;
  })();

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
