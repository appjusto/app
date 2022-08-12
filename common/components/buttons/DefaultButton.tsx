import React from 'react';
import {
  ActivityIndicator,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../styles';

export interface DefaultButtonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  activityIndicator?: boolean;
  icon?: React.ReactNode | ImageSourcePropType;
  secondary?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  grey?: boolean;
  variant?: 'primary' | 'secondary' | 'grey' | 'danger';
}

export default function ({
  title,
  activityIndicator = false,
  icon,
  disabled,
  style,
  children,
  variant = 'primary',
  secondary = false,
  grey,
  ...props
}: DefaultButtonProps) {
  const v = variant ?? (secondary ? 'secondary' : grey ? 'grey' : 'primary');
  const backgroundColor = (() => {
    if (v === 'secondary' || v === 'danger') return colors.white;
    else if (disabled || activityIndicator) return colors.grey500;
    else if (v === 'grey') return colors.grey700;
    else return colors.green500;
  })();
  const borderColor = (() => {
    if (disabled || activityIndicator) return colors.grey500;
    else if (v === 'secondary') return colors.black;
    else if (v === 'grey') return colors.grey700;
    else if (v === 'danger') return colors.red;
    else return colors.green500;
  })();
  const color = (() => {
    if (disabled) {
      if (v === 'grey') return colors.grey500;
      else return colors.grey700;
    } else if (v === 'grey') {
      return colors.white;
    } else if (v === 'danger') {
      return colors.red;
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: halfPadding }}>
            <Text style={{ ...texts.sm, color }}>{title}</Text>
            {icon}
          </View>
        )}
        {activityIndicator && (
          <ActivityIndicator
            size="small"
            color={variant === 'secondary' || variant === 'danger' ? colors.black : colors.white}
          />
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
}
