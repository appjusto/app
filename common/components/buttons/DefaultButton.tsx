import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewProps,
  TouchableOpacityProps,
} from 'react-native';

import { borders, colors, texts } from '../../styles';
import ShowIf from '../views/ShowIf';

export interface DefaultButtonProps extends TouchableOpacityProps, ViewProps {
  title: string;
  activityIndicator?: boolean;
  isWhite?: boolean;
}

export default function ({
  title,
  disabled,
  isWhite,
  style: externalStyle,
  activityIndicator = false,
  ...props
}: DefaultButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} {...props}>
      {isWhite ? (
        <View
          style={[
            {
              ...styles.buttonContainer,
              backgroundColor: disabled || activityIndicator ? colors.white : colors.green,
              ...borders.default,
              borderColor: disabled || activityIndicator ? colors.black : colors.green,
            },
            externalStyle,
          ]}
        >
          <ShowIf test={!activityIndicator}>
            {() => <Text style={{ ...texts.medium, color: colors.black }}>{title}</Text>}
          </ShowIf>
          <ShowIf test={activityIndicator}>
            {() => <ActivityIndicator size="small" color={colors.grey} />}
          </ShowIf>
        </View>
      ) : (
        <View
          style={[
            {
              ...styles.buttonContainer,
              backgroundColor: disabled || activityIndicator ? colors.grey : colors.green,
            },
            externalStyle,
          ]}
        >
          <ShowIf test={!activityIndicator}>
            {() => (
              <Text style={{ ...texts.medium, color: disabled ? colors.white : colors.black }}>
                {title}
              </Text>
            )}
          </ShowIf>
          <ShowIf test={activityIndicator}>
            {() => <ActivityIndicator size="small" color={colors.white} />}
          </ShowIf>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 14.5,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center', //the container shrinks to the size of its content
  },
});
