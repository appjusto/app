import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ButtonProps,
  ActivityIndicator,
  ViewProps,
} from 'react-native';

import ShowIf from './ShowIf';
import { colors, texts } from './styles';

export interface Props extends ButtonProps, ViewProps {
  activityIndicator?: boolean;
}

export default function ({
  title,
  disabled,
  style: externalStyle,
  activityIndicator = false,
  ...props
}: Props) {
  return (
    <TouchableOpacity {...props}>
      <View
        style={[
          {
            ...styles.buttonContainer,
            backgroundColor: disabled ? colors.grey : colors.green,
          },
          externalStyle,
        ]}
      >
        <ShowIf test={!activityIndicator}>
          {() => (
            <Text style={{ ...styles.text, color: disabled ? colors.white : colors.black }}>
              {title}
            </Text>
          )}
        </ShowIf>
        <ShowIf test={activityIndicator}>{() => <ActivityIndicator />}</ShowIf>
      </View>
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
  text: {
    ...texts.default,
    fontSize: 16,
    lineHeight: 19,
    height: 19,
  },
});
