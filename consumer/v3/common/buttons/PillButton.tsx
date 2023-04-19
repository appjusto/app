import React from 'react';
import { Pressable, Text, View, ViewProps } from 'react-native';
import { borderRadius2 } from '../styles/borders';
import { colors } from '../styles/colors';
import { padding1, padding3 } from '../styles/padding';

interface Props extends ViewProps {
  title: string;
  onPress: () => void;
}

export const PillButton = ({ title, onPress, style, ...props }: Props) => {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      {({ pressed }) => (
        <View
          style={[
            {
              paddingHorizontal: padding3,
              paddingVertical: padding1,
              backgroundColor: colors.yellow,
              opacity: pressed ? 0.8 : 1,
              borderRadius: borderRadius2,
            },
            style,
          ]}
          {...props}
        >
          <Text>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};
