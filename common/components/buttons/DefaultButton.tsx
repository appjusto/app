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
import ShowIf from '../views/ShowIf';

export interface DefaultButtonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  activityIndicator?: boolean;
  secondary?: boolean;
}

export default function ({
  title,
  disabled,
  style: externalStyle,
  secondary = false,
  activityIndicator = false,
  ...props
}: DefaultButtonProps) {
  const backgroundColor = secondary
    ? colors.white
    : disabled || activityIndicator
    ? colors.grey500
    : colors.green500;
  const borderColor =
    disabled || activityIndicator ? colors.grey500 : secondary ? colors.black : colors.green500;
  const color = disabled ? (secondary ? colors.grey500 : colors.white) : colors.black;

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
          externalStyle,
        ]}
      >
        <ShowIf test={!activityIndicator}>
          {() => <Text style={{ ...texts.sm, color }}>{title}</Text>}
        </ShowIf>
        <ShowIf test={activityIndicator}>
          {() => <ActivityIndicator size="small" color={secondary ? colors.black : colors.white} />}
        </ShowIf>
      </View>
    </TouchableOpacity>
  );
}
