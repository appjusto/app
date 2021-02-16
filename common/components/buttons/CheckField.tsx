import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { colors, halfPadding, texts } from '../../styles';

interface Props extends ViewProps {
  text: string;
  checked?: boolean;
  onPress: () => void;
}

export default ({ text, checked = false, style, onPress }: Props) => {
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
        <View style={{ borderWidth: 2, borderRadius: 4, padding: 2, width: 24, height: 24 }}>
          {checked && (
            <View
              style={{ backgroundColor: colors.green500, borderRadius: 4, width: 16, height: 16 }}
            />
          )}
        </View>
        <Text style={{ ...texts.xs, marginLeft: halfPadding }}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
