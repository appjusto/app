import React from 'react';
import { Text, TextInputProps, View } from 'react-native';
import { borders, colors, texts } from '../../styles';

export interface Props extends TextInputProps {
  title: string;
  placeholder?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default ({ title, placeholder, children, style, disabled, ...props }: Props) => (
  <View
    style={[
      {
        height: 60,
        ...borders.default,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderColor: disabled ? colors.grey700 : colors.grey500,
      },
      style,
    ]}
  >
    <View>
      <Text
        style={{
          ...texts.xs,
          paddingVertical: 2,
          color: disabled ? colors.grey700 : colors.green600,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...texts.md,
          color: children ? colors.grey700 : colors.grey500,
          flexWrap: 'wrap',
        }}
        {...props}
        numberOfLines={2}
      >
        {children ?? placeholder}
      </Text>
    </View>
  </View>
);
