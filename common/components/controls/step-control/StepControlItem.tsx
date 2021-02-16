import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { colors, texts } from '../../../styles';

interface Props extends ViewProps {
  children: string;
  active?: boolean;
}

export const StepControlItem = React.forwardRef<View, Props>(
  ({ children, active = false, style, ...props }: Props, ref) => {
    return (
      <View ref={ref} style={[null, style]} {...props}>
        <Text style={[texts.medium, !active && { color: colors.grey }]}>{children}</Text>
      </View>
    );
  }
);
