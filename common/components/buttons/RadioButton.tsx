import React from 'react';
import { Text, TouchableWithoutFeedback, View, ViewProps } from 'react-native';
import { colors, halfPadding, texts } from '../../styles';

interface Props extends ViewProps {
  title: string;
  checked?: boolean;
  onPress: () => void;
  variant: 'circle' | 'square';
}

export default function ({ title, checked, onPress, style, variant = 'circle', ...props }: Props) {
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
        <View
          style={{
            borderWidth: 2,
            borderRadius: variant === 'circle' ? 12 : 4,
            padding: 2,
            width: 24,
            height: 24,
            backgroundColor: colors.white,
          }}
        >
          {checked && (
            <View
              style={{
                backgroundColor: colors.green500,
                borderRadius: variant === 'circle' ? 8 : 4,
                width: 16,
                height: 16,
              }}
            />
          )}
        </View>
        <Text style={{ ...texts.xs, marginLeft: halfPadding }}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
