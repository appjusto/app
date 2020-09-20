import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

import { borders, colors, texts } from '../../styles';

type Props = {
  title: string;
  active?: boolean;
  onPress: () => void;
};

export default function ({ title, active = false, onPress }: Props) {
  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: active ? colors.lightGreen : colors.lightGrey,
            ...borders.default,
            borderColor: active ? colors.lightGreen : colors.lightGrey,
          }}
        />
      </TouchableWithoutFeedback>
      <Text style={[texts.small, { color: active ? colors.black : colors.darkGrey }]}>{title}</Text>
    </View>
  );
}
