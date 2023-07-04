import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { colors, padding, texts } from '../../../../../common/styles';
interface Props extends ViewProps {
  title: string;
  description: string;
}

export const AlertBox = ({ title, description, children, style, ...props }: Props) => {
  return (
    <View
      style={[style, { backgroundColor: colors.yellow, borderWidth: 1, borderRadius: 8, padding }]}
      {...props}
    >
      <Text
        style={{
          ...texts.sm,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...texts.xs,
          color: colors.grey700,
        }}
      >
        {description}
      </Text>
    </View>
  );
};
