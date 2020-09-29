import React from 'react';
import { Text, TouchableWithoutFeedback, View, Image } from 'react-native';

import { borders, colors, texts } from '../../styles';

type Props = {
  title: string;
  icon: any;
  active?: boolean;
  onPress: () => void;
};

export default function ({ title, icon, active = false, onPress }: Props) {
  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: active ? colors.green : colors.lightGrey,
            ...borders.default,
            borderColor: active ? colors.green : colors.lightGrey,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image source={icon} />
        </View>
      </TouchableWithoutFeedback>
      <Text style={[texts.small, { color: active ? colors.black : colors.darkGrey }]}>{title}</Text>
    </View>
  );
}
