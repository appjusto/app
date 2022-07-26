import React from 'react';
import { Text, TouchableWithoutFeedback, View, ViewProps } from 'react-native';
import { colors, halfPadding, padding, texts } from '../../styles';

interface Props extends ViewProps {
  text?: string;
  checked?: boolean;
  onPress?: () => void;
  variant?: 'square' | 'circle';
}

export default ({ text, checked = false, style, onPress, variant = 'square' }: Props) => {
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
            // borderRadius: 4,
            borderRadius: variant === 'square' ? 4 : 12,
            padding: 2,
            width: 24,
            height: 24,
            backgroundColor: colors.white,
          }}
        >
          {checked && (
            <View
              style={{ backgroundColor: colors.green500, borderRadius: 4, width: 16, height: 16 }}
            />
          )}
        </View>
        {text ? (
          <Text
            style={{
              ...texts.xs,
              // borderWidth: 1,
              marginLeft: halfPadding,
              marginRight: padding,
            }}
          >
            {text}
          </Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};
