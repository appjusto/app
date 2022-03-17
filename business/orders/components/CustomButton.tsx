import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { borders, colors, padding, texts } from '../../../common/styles';

interface Props extends TouchableOpacityProps, ViewProps {
  title: string;
  bgColor: string;
  textColor: string;
  activityIndicator?: boolean;
}

export const CustomButton = ({
  title,
  bgColor,
  textColor,
  disabled,
  style,
  activityIndicator,
  ...props
}: Props) => {
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
        {!activityIndicator ? (
          <Text style={{ ...texts.sm, color: textColor }}>{title}</Text>
        ) : (
          <ActivityIndicator size="small" color={colors.black} />
        )}
      </View>
    </TouchableOpacity>
  );
};
