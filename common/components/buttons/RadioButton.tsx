import React from 'react';
import { Text, TouchableWithoutFeedback, View, ViewProps } from 'react-native';
import { colors, halfPadding, texts } from '../../styles';

interface Props extends ViewProps {
  title: string;
  checked?: boolean;
  onPress: () => void;
}

export default function ({ title, checked, onPress, style, ...props }: Props) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <View style={{ borderWidth: 2, borderRadius: 24, padding: 2, width: 24, height: 24 }}>
          {checked && (
            <View
              style={{ backgroundColor: colors.green500, borderRadius: 16, width: 16, height: 16 }}
            />
          )}
        </View>
        <Text style={{ ...texts.xs, marginLeft: halfPadding }}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
