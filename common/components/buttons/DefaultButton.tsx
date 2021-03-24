import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { t } from '../../../strings';
import { borders, colors, padding, texts } from '../../styles';
import RoundedText from '../texts/RoundedText';

export interface DefaultButtonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  activityIndicator?: boolean;
  icon?: React.ReactNode;
  secondary?: boolean;
  newFeature?: boolean;
}

export default function ({
  title,
  activityIndicator = false,
  icon,
  secondary = false,
  disabled,
  style,
  newFeature,
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
        {newFeature && (
          <RoundedText backgroundColor={colors.darkYellow} style={{ right: -64 }}>
            {t('Novo!')}
          </RoundedText>
        )}
      </View>
    </TouchableOpacity>
  );
}
